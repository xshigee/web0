    
# dotnetでC#を動かす(ver2,Mac対応)   

2023/7/3     
初版    
  
## 概要
本記事は[dotnetでC#を動かす](https://xshigee.github.io/web0/md/dotnet_Cs.html)の改版にあたる。
Mac対応、実行形式の作成などを追加している。  

---

dotnet環境でC#を動かす。  
dotnet環境の特徴として、windows,linuxなどのマルチプラットフォームで動作するので、
ここでは、winodews,linux(ubuntu),Macでのインストールとビルド実行について説明する。  
実行サンプルのOSCとOpenXmlは
旧記事[dotnetでC#を動かす](https://xshigee.github.io/web0/md/dotnet_Cs.html)を参照のこと。
ここでの実行サンプルはCCMapperを紹介するがライブラリの関係でWindows/Mac用となる。(linuxでは動作しない)  
古い記事を参照しなくても良いように、そのまま利用できるところは、同じ内容になっている。

## インストール
以下の手順でdotnet環境をインストールする：

* Windows10の場合
以下のurlからインストーラーをダウンロードして実行する。

https://dotnet.microsoft.com/ja-jp/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer


* linux(ubuntu)の場合

[Ubuntu に .NET SDK または .NET ランタイムをインストールする](https://docs.microsoft.com/ja-jp/dotnet/core/install/linux-ubuntu)  
上のリンクにある説明どおり以下を実行する：

```bash

#「20.04」は、実際に使用しているubuntuのバージョン番号を代入する。

wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get update
sudo apt-get install -y dotnet-sdk-6.0
sudo apt-get install -y aspnetcore-runtime-6.0

```
* Macの場足
以下のURLを参照してダウンロード＆インストールする：  
[Installing the .NET Core SDK](https://dotnet-cookbook.dmitriydubson.com/getting-started/installing-the-sdk/)  
[.NET のダウンロード](https://dotnet.microsoft.com/ja-jp/download)  

## 1.プロジェクト作成
インストールが終わったら以下の手順でプロジェクトを作成する：

```bash

# dotnetのバージョンを確認する
dotnet --version
7.0.100

# プロジェクトを作成する
mkdir xxxx(xxxxはプロジェクト名で任意)
dotnet new console(コンソールのアプリの雛形を作成)

# プロジェクトのディレクトリに入る
cd xxxx

# 実行の確認
dotnet run
# 雛形のプログラムが実行される
Hello, World!

````
この時点で、プログラムの雛形のProgram.csとプロジェクトファイル.csprojが作成される。


## 2.プログラム作成
雛形のプログラムの内容を実際に使用するプログラムに変更する。  
ここでは[OSC_CCMapper3(RiMidi) for Win/Mac](https://xshigee.github.io/web0/md/OSC_CCMapper3_Win_Mac.html) のソースを利用する。


Program.cs  
```cs

// osc_CCMapper3_RtMidi

// OSC controled CCMapper3(RiMidi) for Win/Mac
// written by: xshige
// 2023/1/26

/************************************

2023/1/26
 
Mix16/TouchOSC controler

toggles
1: Velocity Fixed/PANIC button: toggle 
2: AT/PP: toggle
3: CC74: toggle
4: CC26: toggle
5: CC11: toggle
6: CC7 : toggle
7: CC2 : toggle
8: CC1 : toggle

faders
1: Fixed Velocity value(0-127)
8: Modulation Depth value(0-2.0) // related CC1

experimental
xy
x: PitchBend
y: Cutoff(CC74)

************************************/


// CCMapper3(RiMidi) for Win/Mac
// written by:xshige

// 2023/1/22
// Panic button
// z

// 2023/1/5
// PitchBen(d) transefer
// d toggle

// Velocity F(i)xed
// i toggle

// 2022/12/15
// Pitch Bend transfer

// NoteOn/Off Tranfer Switch added
// t toggle

// 2022/12/10 Transpose added
// [↑] [↓] +/- semitone
// [←] [→] -/+ octave

// 2022/12/1 Keycontrol Support
//-----------------------------
// modifier:
// 1(x1) 2(x2) 3(x3) 4(x4) 5(x5) 6(x6) 7(x7) 8(x8) 9(x9) 0(x10)

// CC1(MW):
// m toggle

// CC2(Breath Control)
// b toggle

// CC7(Volume)
// v toggle

// CC11(Expression)
// x toggle

// CC74(CutoffFreq):
// c toggle

// CC26(EqGain)
// e toggle

// AT(Channel Pressure):
// a toggle

// PP(Polyphonic Pressure):
// p toggle

// n NotFixed(apply modifier)
// f Fixed Modifier x1)

// OTHER CC
// o toggle

//---------------------------------

// 2022/11/29: Aftertouch support
// 2022/11/28: CC74 sent for Cutoff Filter
// 2022/11/27: CC1 sent for vibrate
// 2022/11/26: NuRad added
// 2022/11/17: auto selecting input/output devices
// 2022/11/13

using RtMidi.Core.Devices;
using RtMidi.Core.Enums;
using RtMidi.Core.Messages;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Channels;

using Rug.Osc;
using System.Text;
using System.Threading;

namespace RtMidi.Core.CCMapper
{
    public class Program
    {
        static OscReceiver receiver;
        static OscSender sender;
        static Thread thread;

        int limit127(int x, float m)
        {
            int rv = (int)((float)x * m);
            if (127 <= rv)
                rv = 127;
            return rv;
        }

        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
            //.WriteTo.ColoredConsole()
            .WriteTo
                .Console()
                //.MinimumLevel.Debug() // disp debug info.
                .CreateLogger();

            using (MidiDeviceManager.Default)
            {
                var p = new Program();
            }
        }

        public Program()
        {

            // MIDI devices
            var inputList = new List<IMidiInputDevice>();
            var outputList = new List<IMidiOutputDevice>();

            NoteOnMessage curMsg = new NoteOnMessage();
            var prevC = ConsoleKey.A;

            int transpose = 0; // transpose offset

            float cc1mod = 1;

            bool logOut = false; //20023/1/9 // true to disp log on console

            bool enableSendNote = true; // false will Note send note

            bool enableCC1 = false; // 2023/1/5: true will send CC1, false will send received CC1
            bool enableCC74 = true; // true will send CC74
            bool enableAT = true; // true will send AT
            bool enablePP = true;
            bool enableVL = true; // volume
            bool enableBC = true; // breath
            bool enableCC26 = true; // EqGain
            bool enableEX = true; // Expression
            bool enableOTHER = false; // 2023/1/5: other CC

            bool enablePB = true; //  2023/1/5: true will send PB
            bool enableVFixed = false; // 2023/1/5
            int VFixedValue = 77; // 2023/1/5

            bool chgCC1 = false; // true will change mod value
            bool chgCC74 = false;
            bool chgAT = false;
            bool chgPP = false;
            bool chgVL = false;
            bool chgBC = false;
            bool chgEX = false;

            float modDepth = 1; // Modulation Depth

            //------------------------------------------------------------------------
            // OSC related

            bool OSCdebug = false; // true to disp log

            static string ByteArrayToString(byte[] ba)
            {
                StringBuilder hex = new StringBuilder(ba.Length * 3);
                foreach (byte b in ba)
                    hex.AppendFormat("{0:x2}:", b);
                return hex.ToString();
            }

            int port = 8000;
            int outPort = 9000;
            IPAddress sendAddress = IPAddress.Parse("192.168.1.4"); // IP address of iPhone(TouchOSC)

            // Create the receiver
            receiver = new OscReceiver(port);
            // Create the sender
            sender = new OscSender(sendAddress, outPort);

            // Create a thread to do the listening
            thread = new Thread(new ThreadStart(ListenLoop));

            // Connect the receiver
            receiver.Connect();

            // Start the listen thread
            thread.Start();

            // Connect the sender
            sender.Connect();


            void RestoreFlags()
            {
                // OSC value reset ---------------------------
                float f1 = (float)VFixedValue / 127;
                //Console.WriteLine(f1);
                sender.Send(new OscMessage("/2/fader1", f1));
                Thread.Sleep(100); // NEED THAT!
                sender.Send(new OscMessage("/2/fader2", 0));
                Thread.Sleep(100);
                sender.Send(new OscMessage("/2/fader3", 0));
                Thread.Sleep(100);
                sender.Send(new OscMessage("/2/fader4", 0));
                Thread.Sleep(100);
                sender.Send(new OscMessage("/2/fader5", 0));
                Thread.Sleep(100);
                sender.Send(new OscMessage("/2/fader6", 0));
                Thread.Sleep(100);
                sender.Send(new OscMessage("/2/fader7", 0));
                Thread.Sleep(100);
                float d1 = (float)(modDepth * 0.5);
                sender.Send(new OscMessage("/2/fader8", d1));
                Thread.Sleep(100);
                // toggles
                if (enableCC1) sender.Send(new OscMessage("/2/toggle8", 1));
                else sender.Send(new OscMessage("/2/toggle8", 0));

                if (enableBC) sender.Send(new OscMessage("/2/toggle7", 1));
                else sender.Send(new OscMessage("/2/toggle7", 0));
                
                if (enableVL) sender.Send(new OscMessage("/2/toggle6", 1));
                else sender.Send(new OscMessage("/2/toggle6", 0));
                
                if (enableEX) sender.Send(new OscMessage("/2/toggle5", 1));
                else sender.Send(new OscMessage("/2/toggle5", 0));
                
                if (enableCC26) sender.Send(new OscMessage("/2/toggle4", 1));
                else sender.Send(new OscMessage("/2/toggle4", 0));
                
                if (enableCC74) sender.Send(new OscMessage("/2/toggle3", 1));
                else sender.Send(new OscMessage("/2/toggle3", 0));
                
                if (enableAT) sender.Send(new OscMessage("/2/toggle2", 1));
                else sender.Send(new OscMessage("/2/toggle2", 0));

                if (enableVFixed) sender.Send(new OscMessage("/2/toggle1", 1));
                else sender.Send(new OscMessage("/2/toggle1", 0));

            }


            // OSC listenner
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //static void ListenLoop()
            void ListenLoop()
            {
                try
                {
                    while (receiver.State != OscSocketState.Closed)
                    {
                        // if we are in a state to recieve
                        if (receiver.State == OscSocketState.Connected)
                        {
                            // get the next message
                            // this will block until one arrives or the socket is closed
                            OscPacket packet = receiver.Receive();

                            var arg0 = packet.ToString().Split(',')[0]; // get OSC address

                            // for TouchOSC layout Simple/1 or Mix16/2
                            // faders
                            if (arg0.Equals("/1/fader1") || arg0.Equals("/2/fader1"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                VFixedValue = (int)(f1 * 127);
                                Console.WriteLine("Fixed Velocity: {0}",VFixedValue);
                            }
                            else if (arg0.Equals("/1/fader2") || arg0.Equals("/2/fader2"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader3") || arg0.Equals("/2/fader3"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader4") || arg0.Equals("/2/fader4"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader5") || arg0.Equals("/2/fader5"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader6") || arg0.Equals("/2/fader6"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader7") || arg0.Equals("/2/fader7"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");
                            }
                            else if (arg0.Equals("/1/fader8") || arg0.Equals("/2/fader8"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                modDepth = (float)(f1/0.5);
                                Console.WriteLine("Mod Depth: {0:f3}", modDepth);

                            }
                            //--------------------------------------------------------------------
                            // toggles
                            else if (arg0.Equals("/1/toggle1") || arg0.Equals("/2/toggle1"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                Panic();
                                if (f1 == 0) enableVFixed = false; else enableVFixed = true;
                                if (enableVFixed)
                                    Console.WriteLine("Fixed Velocity enabled");
                                else
                                    Console.WriteLine("Fixed Velocity disabled");

                            }
                            else if (arg0.Equals("/1/toggle2") || arg0.Equals("/2/toggle2"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableAT = false; else enableAT = true;
                                enablePP = enableAT; // sync AT and PP

                                if (enableAT)
                                    Console.WriteLine("AT/PP enabled");
                                else
                                    Console.WriteLine("AT/PP disabled");

                            }
                            else if (arg0.Equals("/1/toggle3") || arg0.Equals("/2/toggle3"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableCC74 = false; else enableCC74 = true;
                                if (enableCC26)
                                    Console.WriteLine("CC74 enabled");
                                else
                                    Console.WriteLine("CC74 disabled");

                            }
                            else if (arg0.Equals("/1/toggle4") || arg0.Equals("/2/toggle4"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableCC26 = false; else enableCC26 = true;
                                if (enableCC26)
                                    Console.WriteLine("CC26 enabled");
                                else
                                    Console.WriteLine("CC26 disabled");

                            }
                            else if (arg0.Equals("/1/toggle5") || arg0.Equals("/2/toggle5"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableEX = false; else enableEX = true;
                                if (enableEX)
                                    Console.WriteLine("CC11 enabled");
                                else
                                    Console.WriteLine("CC11 disabled");

                            }
                            else if (arg0.Equals("/1/toggle6") || arg0.Equals("/2/toggle6"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableVL = false; else enableVL = true;
                                if (enableVL)
                                    Console.WriteLine("CC7 enabled");
                                else
                                    Console.WriteLine("CC7 disabled");

                            }
                            else if (arg0.Equals("/1/toggle7") || arg0.Equals("/2/toggle7"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableBC = false; else enableBC = true;
                                if (enableBC)
                                    Console.WriteLine("CC2 enabled");
                                else
                                    Console.WriteLine("CC2 disabled");


                            }
                            else if (arg0.Equals("/1/toggle8") || arg0.Equals("/2/toggle8"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float f1 = BitConverter.ToSingle(ba, 0);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(f1);
                                if (OSCdebug) Console.WriteLine("");

                                if (f1 == 0) enableCC1 = false; else enableCC1 = true;
                                if (enableCC1)
                                    Console.WriteLine("MW(CC1) enabled");
                                else
                                    Console.WriteLine("MW(CC1) disabled");
                            }
                            //---------------------------------------------------------


                            else if (arg0.Equals("/1/xy") || arg0.Equals("/3/xy"))
                            {
                                var ba = packet.ToByteArray();

                                if (BitConverter.IsLittleEndian)
                                    Array.Reverse(ba);
                                float y = BitConverter.ToSingle(ba, 0);
                                float x = BitConverter.ToSingle(ba, 4);

                                if (OSCdebug) Console.WriteLine(arg0);
                                if (OSCdebug) Console.WriteLine(x);
                                if (OSCdebug) Console.WriteLine(y);

                                if (OSCdebug) Console.WriteLine(packet.ToString()); // debug
                                if (OSCdebug) Console.WriteLine("");

                                // convert int to enums
                                var eChannel = (Enums.Channel)Enum.ToObject(typeof(Enums.Channel), 0);  // zero relative

                                // PitchBend -8191 thru +8191 (0-16382)
                                int int14 = (int)(16382 * x);
                                outputList[0].Send(new PitchBendMessage(eChannel, int14));

                                // CutoffFreq
                                int int7 = (int)(127 * y);
                                outputList[0].Send(new ControlChangeMessage(eChannel, 74, int7));

                            }

                            else if (arg0.Equals("/1")||arg0.Equals("/2")||arg0.Equals("/3")||arg0.Equals("/4"))
                            {
                                if (OSCdebug) Console.WriteLine("debug"); //debug
                                if (OSCdebug) Console.WriteLine(packet.ToString()); // debug
                                if (OSCdebug) Console.WriteLine("");
                            }


                            else if (arg0.Equals("/ping"))
                            {

                                if (OSCdebug) Console.WriteLine("debug"); //debug
                                if (OSCdebug) Console.WriteLine(packet.ToString()); // debug
                                if (OSCdebug) Console.WriteLine("");

                            }

                            // other OSC message
                            else
                            {
                                // Write the packet to the console
                                Console.WriteLine(packet.ToString());
                            }
                            // DO SOMETHING HERE!

                        } //connected
                    }
                }
                catch (Exception ex)
                {
                    // if the socket was connected when this happens
                    // then tell the user
                    if (receiver.State == OscSocketState.Connected)
                    {
                        Console.WriteLine("Exception in listen loop");
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            // Event Handlers

            // Listen to all available midi devices
            void ControlChangeHandler(IMidiInputDevice sender, in ControlChangeMessage msg)
            {
                if (logOut)
                    Console.WriteLine(
                        $"[{sender.Name}] ControlChange: Channel:{msg.Channel} Control:{msg.Control} Value:{msg.Value}"
                    );
                if (msg.Control == 11 || msg.Control == 2)
                {
                    // for Aria
                    if (enableBC)
                    {
                        if (chgBC)
                            outputList[0].Send(
                                new ControlChangeMessage(
                                    msg.Channel,
                                    2,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(new ControlChangeMessage(msg.Channel, 2, msg.Value));
                    }
                    if (enableVL)
                    {
                        if (chgVL)
                            outputList[0].Send(
                                new ControlChangeMessage(
                                    msg.Channel,
                                    7,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(new ControlChangeMessage(msg.Channel, 7, msg.Value));
                    }
                    if (enableCC26)
                        outputList[0].Send(new ControlChangeMessage(msg.Channel, 26, msg.Value));

                    // Expression added
                    if (enableEX)
                    {
                        if (chgEX)
                            outputList[0].Send(
                                new ControlChangeMessage(
                                    msg.Channel,
                                    11,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(
                                new ControlChangeMessage(msg.Channel, 11, msg.Value)
                            );
                    }

                    // CC1 added
                    if (enableCC1)
                    {
                        outputList[0].Send(new ControlChangeMessage(msg.Channel, 1, limit127(msg.Value,modDepth)));
                        /*
                        if (chgCC1)
                            outputList[0].Send(
                                new ControlChangeMessage(
                                    msg.Channel,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(new ControlChangeMessage(msg.Channel, 1, msg.Value));
                        */
                    }

                    // CC74 added
                    if (enableCC74)
                    {
                        if (chgCC74)
                            outputList[0].Send(
                                new ControlChangeMessage(
                                    msg.Channel,
                                    74,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(
                                new ControlChangeMessage(msg.Channel, 74, msg.Value)
                            );
                    }

                    // Aftertouch for Channel
                    if (enableAT)
                    {
                        if (chgAT)
                            outputList[0].Send(
                                new ChannelPressureMessage(msg.Channel, limit127(msg.Value, cc1mod))
                            );
                        else
                            outputList[0].Send(new ChannelPressureMessage(msg.Channel, msg.Value));

                        //outputList[0].Send(new PitchBendMessage(msg.Channel, msg.Value));
                    }

                    // Aftertouch for key
                    if (enablePP)
                    {
                        // convert enums to int for transpose
                        int iKey = (int)curMsg.Key;
                        iKey += transpose;
                        var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                        if (chgPP)
                            outputList[0].Send(
                                new PolyphonicKeyPressureMessage(
                                    curMsg.Channel,
                                    eKey,
                                    limit127(msg.Value, cc1mod)
                                )
                            );
                        else
                            outputList[0].Send(
                                new PolyphonicKeyPressureMessage(curMsg.Channel, eKey, msg.Value)
                            );
                    }
                }

                if (msg.Control == 1)
                {
                    if (!enableCC1)
                        outputList[0].Send(new ControlChangeMessage(msg.Channel, 1, msg.Value));
                }

                // the following CC ignore(not sent)
                if (msg.Control == 7)
                    return; // EWI5000
                if (msg.Control == 68)
                    return; // EWI5000
                if (msg.Control == 74)
                    return; // EWI5000
                if (msg.Control == 34)
                    return; // CC#34(Hires/Breath Controler) ignored
                if (msg.Control == 39)
                    return; // CC#39(Hires/Volume) ignored
                if (msg.Control == 43)
                    return; // CC#43(Hires/Expression) ignored
                if (msg.Control == 88)
                    return; // CC#88(Hires/NoteOn) ignored
                // portamento/glide support
                if (msg.Control == 65)
                { // portamento on/off
                    outputList[0].Send(new ControlChangeMessage(msg.Channel, 65, msg.Value));
                    //if (PORTA.value) {
                    //    midiout.send_message(message);
                    //    return;
                    //}
                    if (msg.Control == 5)
                    { // portamento/glide time
                        outputList[0].Send(new ControlChangeMessage(msg.Channel, 5, msg.Value));
                        //if (PORTA.value) {
                        //    midiout.send_message(message);
                        //    return;
                        //}
                    }
                    if (msg.Control == 84)
                    { // portamento control
                        outputList[0].Send(new ControlChangeMessage(msg.Channel, 84, msg.Value));
                        //if (PORTA.value) {
                        //    midiout.send_message(message);
                        //    return;
                        //}
                    }
                    //----------------------
                    else // other CC
                    {
                        if (enableOTHER)
                            outputList[0].Send(msg);
                        return;
                    }
                }
            }

            void NoteOnHandler(IMidiInputDevice sender, in NoteOnMessage msg)
            {
                if (logOut)
                    Console.WriteLine(
                        $"[{sender.Name}] NoteOn: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}"
                    );

                // convert enums to int for transpose
                int iKey = (int)msg.Key; // bug fixed 2023/1/8: NG:curMsg.Key;
                iKey += transpose;
                var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                // change NoteOn to NoteOff (patch 2023/1/21 for NuRad)
                if (msg.Velocity == 0)
                {
                    outputList[0].Send(new NoteOffMessage(msg.Channel, eKey, msg.Velocity));
                    return;
                }

                curMsg = msg;

                // 2023/1/5
                int vv;
                if (enableVFixed)
                    vv = VFixedValue;
                else
                    vv = msg.Velocity;
                //
                if (enableSendNote)
                    outputList[0].Send(new NoteOnMessage(msg.Channel, eKey, vv));
            }

            void NoteOffHandler(IMidiInputDevice sender, in NoteOffMessage msg)
            {
                if (logOut)
                    Console.WriteLine(
                        $"[{sender.Name}] NoteOff: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}"
                    );

                // convert enums to int for transpose
                int iKey = (int)msg.Key; // bug fixed 2023/1/8: NG:curMsg.Key;
                iKey += transpose;
                var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                if (enableSendNote)
                    outputList[0].Send(new NoteOffMessage(msg.Channel, eKey, msg.Velocity));
            }

            void ChannelPressureHandler(IMidiInputDevice sender, in ChannelPressureMessage msg)
            {
                outputList[0].Send(new ChannelPressureMessage(msg.Channel, msg.Pressure));
            }

            void PolyphonicKeyPressureHandler(
                IMidiInputDevice sender,
                in PolyphonicKeyPressureMessage msg
            )
            {
                outputList[0].Send(
                    new PolyphonicKeyPressureMessage(msg.Channel, msg.Key, msg.Pressure)
                );
            }

            void PitchBendHandler(IMidiInputDevice sender, in PitchBendMessage msg)
            {
                if (enablePB)
                    outputList[0].Send(new PitchBendMessage(msg.Channel, msg.Value));
            }

            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            void Panic()
            {
                var eChannel = (Enums.Channel)Enum.ToObject(typeof(Enums.Channel), 1);

                // All Sound Off
                outputList[0].Send(new ControlChangeMessage(eChannel, 120, 0));
                // All Note Off
                outputList[0].Send(new ControlChangeMessage(eChannel, 123, 0));
            }

            //-------------------------------------------------------------------------

            // the following device will be opened
            string ID0 = "WIDI Bud Pro"; // for Windows/Linux
            string ID1 = "Elefue"; // for Mac
            string ID2 = "re.corder"; // for Mac
            string ID3 = "Nu"; // for Mac (with WIDI Master/NuRAD,NuEVI)
            string ID4 = "EWI"; // for Mac (with WIDI Master/EWI5000,EWI4000,EVI3010 etc)
            string ID5 = "AE-"; // for Mac (Roland)
            string ID6 = "YDS-"; // for Mac (YAMAHA)
            string ID7 = "Saxophone"; // for USB-MIDI (YAMAHA)
            string OD = "loopMIDI"; // for Windows/Mac
            //string OD = "SE-0"; // for Mac

            // List all available MIDI API's
            foreach (var api in MidiDeviceManager.Default.GetAvailableMidiApis())
            {
                Console.WriteLine($"Available API: {api}");
            }

            try
            {
                // disp input/output devices
                Console.WriteLine("---- INPUT DEVICE ----");
                foreach (var inputDeviceInfo in MidiDeviceManager.Default.InputDevices)
                {
                    Console.WriteLine($"{inputDeviceInfo.Name}");
                }
                Console.WriteLine("---- OUTPUT DEVICE ----");
                foreach (var outputDeviceInfo in MidiDeviceManager.Default.OutputDevices)
                {
                    Console.WriteLine($"{outputDeviceInfo.Name}");
                }

                Console.WriteLine("-----------------------");
                foreach (var inputDeviceInfo in MidiDeviceManager.Default.InputDevices)
                {
                    // one device only
                    if (inputDeviceInfo.Name.Contains(ID0))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID1");
                    if (inputDeviceInfo.Name.Contains(ID1))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID2");
                    if (inputDeviceInfo.Name.Contains(ID2))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID3");
                    if (inputDeviceInfo.Name.Contains(ID3))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID4");
                    if (inputDeviceInfo.Name.Contains(ID4))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID5");
                    if (inputDeviceInfo.Name.Contains(ID5))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID6");
                    if (inputDeviceInfo.Name.Contains(ID6))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                    //Console.WriteLine("ID7");
                    if (inputDeviceInfo.Name.Contains(ID7))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler;
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.Open();

                        break;
                    }
                }

                //---------------------------------------------------------------------
                foreach (var outputDeviceInfo in MidiDeviceManager.Default.OutputDevices)
                {
                    // one device only
                    if (outputDeviceInfo.Name.Contains(OD))
                    {
                        Console.WriteLine($"Opening output:[{outputDeviceInfo.Name}]");

                        // check Windows or Mac
                        /*
                        if (outputDeviceInfo.Name.Contains("bus1")) enableSendNote = false;
                        if (!enableSendNote) Console.WriteLine("running at Mac Env.");
                        else Console.WriteLine("running at Windows Env.");
                        */
                        if (outputDeviceInfo.Name.Contains("bus1"))
                            Console.WriteLine("running at Mac Env.");
                        else
                            Console.WriteLine("running at Windows Env.");

                        var outputDevice = outputDeviceInfo.CreateDevice();
                        outputList.Add(outputDevice);

                        outputDevice.Open();
                    }
                }

                Console.WriteLine(
                    "MW(CC1)/BC/VL/EX/CF(CC74)/CC26/AT(CP/PP)/other/PANIC/Tranpose PitchBend_xfer support version"
                );
                //Console.WriteLine("Press 'q' key to stop...");
                Console.WriteLine("Press '^C' key to exit...");

                RestoreFlags();

                while (true)
                {
                    var c = Console.ReadKey();
                    if (c.Key == ConsoleKey.Q)
                    {
                        break;
                    }
                    if (c.Key == ConsoleKey.D1)
                    {
                        Console.WriteLine("");

                        cc1mod = 1;

                        Console.WriteLine("mod: x1");
                    }

                    if (c.Key == ConsoleKey.D2)
                    {
                        Console.WriteLine("");

                        cc1mod = 2;

                        Console.WriteLine("mod: x2");
                    }

                    if (c.Key == ConsoleKey.D3)
                    {
                        Console.WriteLine("");

                        cc1mod = 3;

                        Console.WriteLine("mod: x3");
                    }

                    if (c.Key == ConsoleKey.D4)
                    {
                        Console.WriteLine("");

                        cc1mod = 4;

                        Console.WriteLine("mod: x4");
                    }
                    if (c.Key == ConsoleKey.D5)
                    {
                        Console.WriteLine("");

                        cc1mod = 5;

                        Console.WriteLine("mod: x5");
                    }
                    if (c.Key == ConsoleKey.D6)
                    {
                        Console.WriteLine("");

                        cc1mod = 6;

                        Console.WriteLine("mod: x6");
                    }
                    if (c.Key == ConsoleKey.D7)
                    {
                        Console.WriteLine("");

                        cc1mod = 7;

                        Console.WriteLine("mod: x7");
                    }
                    if (c.Key == ConsoleKey.D8)
                    {
                        Console.WriteLine("");

                        cc1mod = 8;

                        Console.WriteLine("mod: x8");
                    }
                    if (c.Key == ConsoleKey.D9)
                    {
                        Console.WriteLine("");

                        cc1mod = 9;

                        Console.WriteLine("mod: x9");
                    }
                    if (c.Key == ConsoleKey.D0)
                    {
                        Console.WriteLine("");

                        cc1mod = 10;

                        Console.WriteLine("mod: x10");
                    }
                    //  transpose
                    if (c.Key == ConsoleKey.UpArrow)
                    {
                        //Console.WriteLine("");

                        transpose++;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    if (c.Key == ConsoleKey.DownArrow)
                    {
                        //Console.WriteLine("");

                        transpose--;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    //--
                    if (c.Key == ConsoleKey.LeftArrow)
                    {
                        //Console.WriteLine("");

                        transpose -= 12;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    if (c.Key == ConsoleKey.RightArrow)
                    {
                        //Console.WriteLine("");

                        transpose += 12;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    //----------------------------------------
                    if (c.Key == ConsoleKey.A)
                    {
                        Console.WriteLine("");

                        enableAT = (!enableAT);
                        if (enableAT)
                            Console.WriteLine("AT(CP) enabled");
                        else
                            Console.WriteLine("AT(CP) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.C)
                    {
                        Console.WriteLine("");

                        enableCC74 = (!enableCC74);
                        if (enableCC74)
                            Console.WriteLine("CF(CC74) enabled");
                        else
                            Console.WriteLine("CF(CC74) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.M)
                    {
                        Console.WriteLine("");

                        enableCC1 = (!enableCC1);
                        if (enableCC1)
                            Console.WriteLine("MW(CC1) enabled");
                        else
                            Console.WriteLine("MW(CC1) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.P)
                    {
                        Console.WriteLine("");

                        enablePP = (!enablePP);
                        if (enablePP)
                            Console.WriteLine("AT(PP) enabled");
                        else
                            Console.WriteLine("AT(PP) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.B)
                    {
                        Console.WriteLine("");

                        enableBC = (!enableBC);
                        if (enableBC)
                            Console.WriteLine("BC enabled");
                        else
                            Console.WriteLine("BC disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.V)
                    {
                        Console.WriteLine("");

                        enableVL = (!enableVL);
                        if (enableVL)
                            Console.WriteLine("VL enabled");
                        else
                            Console.WriteLine("VL disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.E)
                    {
                        Console.WriteLine("");

                        enableCC26 = (!enableCC26);
                        if (enableCC26)
                            Console.WriteLine("CC26 enabled");
                        else
                            Console.WriteLine("CC26 disabled");

                        //prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.X)
                    {
                        Console.WriteLine("");

                        enableEX = (!enableEX);
                        if (enableEX)
                            Console.WriteLine("EX enabled");
                        else
                            Console.WriteLine("EX disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.O)
                    {
                        Console.WriteLine("");

                        enableOTHER = (!enableOTHER);
                        if (enableOTHER)
                            Console.WriteLine("Other enabled");
                        else
                            Console.WriteLine("Other disabled");

                        //prevC = c.Key;
                    }
                    // 2023/1/5
                    if (c.Key == ConsoleKey.D)
                    {
                        Console.WriteLine("");

                        enablePB = (!enablePB);
                        if (enablePB)
                            Console.WriteLine("PB enabled");
                        else
                            Console.WriteLine("PB disabled");
                    }
                    if (c.Key == ConsoleKey.I)
                    {
                        Console.WriteLine("");

                        enableVFixed = (!enableVFixed);
                        if (enableVFixed)
                            Console.WriteLine("Velocity Fixed");
                        else
                            Console.WriteLine("Velociry Dynamic");
                    }

                    //---------------------------------------------
                    if (c.Key == ConsoleKey.S)
                    {
                        Console.WriteLine("");

                        // disp setup status
                        Console.WriteLine(
                            "chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1,
                            chgCC74,
                            chgAT,
                            chgPP,
                            chgVL,
                            chgBC,
                            cc1mod
                        );
                    }
                    //---------------------------------------------
                    // None Fixed Modifier
                    if (c.Key == ConsoleKey.N)
                    {
                        Console.WriteLine("");

                        if (prevC == ConsoleKey.M)
                        {
                            enableCC1 = true;
                            chgCC1 = true;

                            Console.WriteLine("MW(CC1) changed modifier");
                        }
                        if (prevC == ConsoleKey.C)
                        {
                            enableCC74 = true;
                            chgCC74 = true;

                            Console.WriteLine("CF(CC74) changed modifier");
                        }
                        if (prevC == ConsoleKey.A)
                        {
                            enableAT = true;
                            chgAT = true;

                            Console.WriteLine("AT(CP) changed modifier");
                        }
                        if (prevC == ConsoleKey.P)
                        {
                            enablePP = true;
                            chgPP = true;

                            Console.WriteLine("AT(PP) changed modifier");
                        }

                        if (prevC == ConsoleKey.V)
                        {
                            enableVL = true;
                            chgVL = true;

                            Console.WriteLine("VL changed modifier");
                        }

                        if (prevC == ConsoleKey.B)
                        {
                            enableBC = true;
                            chgBC = true;

                            Console.WriteLine("BC changed modifier");
                        }
                        // disp setup status
                        Console.WriteLine(
                            "chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1,
                            chgCC74,
                            chgAT,
                            chgPP,
                            chgVL,
                            chgBC,
                            cc1mod
                        );
                    }
                    // Fixed Modifier(x1)
                    if (c.Key == ConsoleKey.F)
                    {
                        Console.WriteLine("");

                        if (prevC == ConsoleKey.M)
                        {
                            enableCC1 = true;
                            chgCC1 = false;

                            Console.WriteLine("MW(CC1) fixed modifier");
                        }
                        if (prevC == ConsoleKey.C)
                        {
                            enableCC74 = true;
                            chgCC74 = false;

                            Console.WriteLine("CF(CC1) fixed modifier");
                        }
                        if (prevC == ConsoleKey.A)
                        {
                            enableAT = true;
                            chgAT = false;

                            Console.WriteLine("AT(CP) fixed modifier");
                        }
                        if (prevC == ConsoleKey.P)
                        {
                            enablePP = true;
                            chgPP = false;

                            Console.WriteLine("AT(PP) fixed modifier");
                        }
                        if (prevC == ConsoleKey.V)
                        {
                            enableVL = true;
                            chgVL = false;

                            Console.WriteLine("VL fixed modifier");
                        }
                        if (prevC == ConsoleKey.B)
                        {
                            enableBC = true;
                            chgBC = false;

                            Console.WriteLine("BC fixed modifier");
                        }
                        // disp setup status
                        Console.WriteLine(
                            "chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1,
                            chgCC74,
                            chgAT,
                            chgPP,
                            chgVL,
                            chgBC,
                            cc1mod
                        );
                    }
                    //---------------------------------------------
                    // SendNore toggle
                    if (c.Key == ConsoleKey.T)
                    {
                        Console.WriteLine("");

                        enableSendNote = (!enableSendNote);
                        if (enableSendNote)
                            Console.WriteLine("SendNote enabled");
                        else
                            Console.WriteLine("SendNote disabled");
                    }

                    //---------------------------------------------
                    // Panic
                    if (c.Key == ConsoleKey.Z)
                    {
                        Console.WriteLine("");
                        Panic();
                        Console.WriteLine("PANIC Done!");
                    }
                    //===========================================
                }
            } //try
            finally
            {
                foreach (var device in inputList)
                {
                    device.ControlChange -= ControlChangeHandler;
                    device.NoteOn -= NoteOnHandler;
                    device.NoteOff -= NoteOffHandler;
                    device.PitchBend -= PitchBendHandler;
                    device.ChannelPressure -= ChannelPressureHandler;
                    device.PolyphonicKeyPressure -= PolyphonicKeyPressureHandler;

                    device.Dispose();
                }
                foreach (var device in outputList)
                {
                    device.Dispose();
                }
            }
        }
    }
}

```
詳細は[OSC_CCMapper3(RiMidi) for Win/Mac](https://xshigee.github.io/web0/md/OSC_CCMapper3_Win_Mac.html) を参照のこと。


## 3.必要なパッケージの追加
上のプログラムで必要なパッケージを追加する。


```bash

dotnet add package Rug.OSC -s https://www.nuget.org/api/v2
dotnet add package RtMidi.Core -s https://www.nuget.org/api/v2
dotnet add package Serilog.Sinks.Console -s https://www.nuget.org/api/v2

```

## 4.実行ビルド

```bash

# 実行
dotnet run
# 警告などが出るが正常に実行される

# 実行せずにビルドする
dotnet build
   
```

## 5.実行形式の作成

```bash

Macの場合： 
dotnet publish -c Release --self-contained true -r osx-x64

Windowsの場合：
dotnet publish -c Release --self-contained true -r win-x64

Linuxの場合：
dotnet publish -c Release --self-contained true -r linux-x64

```

上の実行後、  
ディレクトリbin/Release/net7.0/osx-x64/publishが作成される。このなかにプロジェクト名xxxxの実行形式が作成される。    
\# Mac/Linuxの場合、ファイルタイプ無し、windowsでは、.exeになる。  

コマンドラインで「./xxxx(.exe)」でプログラムが実行できる。  

## 6.エイリアス(ショートカット)の作成
Macの場合：  
該当するアイコンをポイントしてcontrolを押しながらクリックしてメニューを開く。
その中から「エイリアスを作成」を選択して、エイリアスを作成する。
作成したエリアスはディスクトップなどアクセスしやすい場所におく。

## 参考情報

[.NET Core で 実行ファイル（exe）を作成する方法](https://kagasu.hatenablog.com/entry/2017/04/16/192117)

[コマンドラインでC#プログラミング](https://qiita.com/shuhey/items/b4211f196259156df8f4)  

[PocketBeagleでのC#(mono)インストールメモ](https://beta-notes.way-nifty.com/blog/2018/07/pocketbeaglecmo.html)  

[スプレッドシート (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/spreadsheets)  
[ワープロ (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/word-processing)  
[プレゼンテーション (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/presentations)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

