    
# CCMapper3 for Win/Mac  

2022/12/17      
初版    
  
## 概要    

re.corder/Elefue/EWI5000などのWind_ControlerをWIDI_Bud_Pro経由(Winの場合)で外部音源を接続する際、特にElefueは送信するCC#が11に固定されていてブレスによるコントロールが外部音源(Ariaなど)に反映できず表現力に乏しい。  
これを解決するためにリアルタイムでCC#2またはCC#11を受信して、CC#を任意のもの(複数)に変更するCCMapperをC#で実装した。(Pitch Bendは、そのまま受けて外部音源に送る)  
なお、ソースコードは、Windows/MacOS共通になっている。  

## 準備
1.Windowsの場合、  
仮想MIDIデバイスとして、loopMIDIがインストールされている必要がある。  
参照：[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper3)→[loopMIDI]→ [PC音源]
```

2.Macの場合  
仮想MIDIデバイスとして、IACドライバを設定する。名前はWindowsに合わせて「loopMIDI」とする。
参照：[MacのAudio MIDI設定でMIDI情報をアプリケーション間で送信する](https://support.apple.com/ja-jp/guide/audio-midi-setup/ams1013/mac)  

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→(CCMapper3)→[loopMIDI(IAC)]→ [PC音源]
```

## CCMapper3
CCMapper3のプログラムとしては以下を使用する：  

CCMapper3_cs_RtMidi/Program.cs  
```c#

// CCMapper3(RiMidi) for Win/Mac
// written by:xshige

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
using System.Drawing;
using System.Net;

namespace RtMidi.Core.CCMapper
{
    public class Program
    {
        int limit127(int x, float m)
        {
            int rv = (int)((float)x * m);
            if (127 <= rv) rv = 127;
            return rv;
        }

        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                //.WriteTo.ColoredConsole()
                .WriteTo.Console()
                //.MinimumLevel.Debug() // disp debug info.
                .CreateLogger();

            using (MidiDeviceManager.Default)
            {
                var p = new Program();
            }
        }

        public Program()
        {
            NoteOnMessage curMsg = new NoteOnMessage();
            var prevC = ConsoleKey.A;

            int transpose = 0; // transpose offset

            float cc1mod = 1;

            bool logOut = true; // true to disp log on console

            bool enableSendNote = true; // false will Note send note

            bool enableCC1 = true; // true will send CC1
            bool enableCC74 = true; // true will send CC74
            bool enableAT = true; // true will send AT
            bool enablePP = true;
            bool enableVL = true; // volume
            bool enableBC = true;  // breath
            bool enableCC26 = true; // EqGain
            bool enableEX = true; // Expression
            bool enableOTHER = true; // other CC

            bool chgCC1 = false; // true will change mod value
            bool chgCC74 = false;
            bool chgAT = false;
            bool chgPP = false;
            bool chgVL = false;
            bool chgBC = false;
            bool chgEX = false;

            // the following device will be opened
            string ID0 = "WIDI Bud Pro"; // for Windows
            string ID1 = "Elefue"; // for Mac
            string ID2 = "re.corder"; // for Mac
            string ID3 = "NuRad"; // for Mac
            string OD = "loopMIDI"; // for Windows/Mac
            //string OD = "SE-0"; // for Mac

            var inputList = new List<IMidiInputDevice>();
            var outputList = new List<IMidiOutputDevice>();

            // List all available MIDI API's
            foreach (var api in MidiDeviceManager.Default.GetAvailableMidiApis())
                Console.WriteLine($"Available API: {api}");

            // Listen to all available midi devices
            void ControlChangeHandler(IMidiInputDevice sender, in ControlChangeMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] ControlChange: Channel:{msg.Channel} Control:{msg.Control} Value:{msg.Value}");
                if (msg.Control == 11 || msg.Control == 2)
                {
                    // for Aria
                    if (enableBC)
                    {
                        if (chgBC) outputList[0].Send(new ControlChangeMessage(msg.Channel, 2,
                            limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ControlChangeMessage(msg.Channel, 2, msg.Value));
                    }
                    if (enableVL)
                    {
                        if (chgVL) outputList[0].Send(new ControlChangeMessage(msg.Channel, 7,
                            limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ControlChangeMessage(msg.Channel, 7, msg.Value));
                    }
                    if (enableCC26) outputList[0].Send(new ControlChangeMessage(msg.Channel, 26, msg.Value));

                    // Expression added
                    if (enableEX)
                    {
                        if (chgEX) outputList[0].Send(new ControlChangeMessage(msg.Channel, 11,
                            limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ControlChangeMessage(msg.Channel, 11, msg.Value));
                    }

                    // CC1 added
                    if (enableCC1)
                    {
                        if (chgCC1) outputList[0].Send(new ControlChangeMessage(msg.Channel, 1,
                                limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ControlChangeMessage(msg.Channel, 1, msg.Value));
                    }

                    // CC74 added
                    if (enableCC74)
                    {
                        if (chgCC74) outputList[0].Send(new ControlChangeMessage(msg.Channel, 74,
                                limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ControlChangeMessage(msg.Channel, 74, msg.Value));
                    }

                    // Aftertouch for Channel
                    if (enableAT)
                    {
                        if (chgAT) outputList[0].Send(new ChannelPressureMessage(msg.Channel,
                                limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new ChannelPressureMessage(msg.Channel, msg.Value));

                        //outputList[0].Send(new PitchBendMessage(msg.Channel, msg.Value));

                    }

                    // Aftertouch for key
                    if (enablePP)
                    {
                        // convert enums to int for transpose
                        int iKey = (int)curMsg.Key;
                        iKey += transpose;
                        var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                        if (chgPP) outputList[0].Send(new PolyphonicKeyPressureMessage(curMsg.Channel, eKey,
                                limit127(msg.Value, cc1mod)));
                        else outputList[0].Send(new PolyphonicKeyPressureMessage(curMsg.Channel, eKey, msg.Value));
                    }
                }
                else
                {
                    if (enableOTHER) outputList[0].Send(msg);
                }
            }

            void NoteOnHandler(IMidiInputDevice sender, in NoteOnMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOn: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");

                curMsg = msg;

                // convert enums to int for transpose
                int iKey = (int)msg.Key;
                iKey += transpose;
                var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                if (enableSendNote) outputList[0].Send(new NoteOnMessage(msg.Channel, eKey, msg.Velocity));
            }

            void NoteOffHandler(IMidiInputDevice sender, in NoteOffMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOff: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");

                // convert enums to int for transpose
                int iKey = (int)msg.Key;
                iKey += transpose;
                var eKey = (Enums.Key)Enum.ToObject(typeof(Enums.Key), iKey);

                if (enableSendNote) outputList[0].Send(new NoteOffMessage(msg.Channel, eKey, msg.Velocity));
            }

            void PitchBendHandler(IMidiInputDevice sender, in PitchBendMessage msg)
            {
                outputList[0].Send(new PitchBendMessage(msg.Channel, msg.Value));
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

                        inputDevice.Open();

                        break;
                    }
                    if (inputDeviceInfo.Name.Contains(ID1))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.Open();

                        break;
                    }
                    if (inputDeviceInfo.Name.Contains(ID2))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.Open();

                        break;
                    }
                    if (inputDeviceInfo.Name.Contains(ID3))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.PitchBend += PitchBendHandler;

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
                        if (outputDeviceInfo.Name.Contains("bus1")) Console.WriteLine("running at Mac Env.");
                        else Console.WriteLine("running at Windows Env.");

                        var outputDevice = outputDeviceInfo.CreateDevice();
                        outputList.Add(outputDevice);

                        outputDevice.Open();
                    }
                }

                Console.WriteLine("MW(CC1)/BC/VL/EX/CF(CC74)/CC26/AT(CP/PP)/other/Tranpose PitchBend_xfer support version");
                Console.WriteLine("Press 'q' key to stop...");
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
                        if (enableAT) Console.WriteLine("AT(CP) enabled");
                        else Console.WriteLine("AT(CP) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.C)
                    {
                        Console.WriteLine("");

                        enableCC74 = (!enableCC74);
                        if (enableCC74) Console.WriteLine("CF(CC74) enabled");
                        else Console.WriteLine("CF(CC74) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.M)
                    {
                        Console.WriteLine("");

                        enableCC1 = (!enableCC1);
                        if (enableCC1) Console.WriteLine("MW(CC1) enabled");
                        else Console.WriteLine("MW(CC1) disabled");

                        prevC = c.Key;
                    }
                    if (c.Key == ConsoleKey.P)
                    {
                        Console.WriteLine("");

                        enablePP = (!enablePP);
                        if (enablePP) Console.WriteLine("AT(PP) enabled");
                        else Console.WriteLine("AT(PP) disabled");

                        prevC = c.Key;

                    }
                    if (c.Key == ConsoleKey.B)
                    {
                        Console.WriteLine("");

                        enableBC = (!enableBC);
                        if (enableBC) Console.WriteLine("BC enabled");
                        else Console.WriteLine("BC disabled");

                        prevC = c.Key;

                    }
                    if (c.Key == ConsoleKey.V)
                    {
                        Console.WriteLine("");

                        enableVL = (!enableVL);
                        if (enableVL) Console.WriteLine("VL enabled");
                        else Console.WriteLine("VL disabled");

                        prevC = c.Key;

                    }
                    if (c.Key == ConsoleKey.E)
                    {
                        Console.WriteLine("");

                        enableCC26 = (!enableCC26);
                        if (enableCC26) Console.WriteLine("CC26 enabled");
                        else Console.WriteLine("CC26 disabled");

                        //prevC = c.Key;

                    }
                    if (c.Key == ConsoleKey.X)
                    {
                        Console.WriteLine("");

                        enableEX = (!enableEX);
                        if (enableEX) Console.WriteLine("EX enabled");
                        else Console.WriteLine("EX disabled");

                        prevC = c.Key;

                    }
                    if (c.Key == ConsoleKey.O)
                    {
                        Console.WriteLine("");

                        enableOTHER = (!enableOTHER);
                        if (enableOTHER) Console.WriteLine("Other enabled");
                        else Console.WriteLine("Other disabled");

                        //prevC = c.Key;

                    }
                    //---------------------------------------------
                    if (c.Key == ConsoleKey.S)
                    {
                        Console.WriteLine("");

                        // disp setup status
                        Console.WriteLine("chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1, chgCC74, chgAT, chgPP, chgVL, chgBC, cc1mod);
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
                        Console.WriteLine("chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1, chgCC74, chgAT, chgPP, chgVL, chgBC, cc1mod);
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
                        Console.WriteLine("chgCC1:{0} chgCC74:{1} chgAT:{2} chgPP:{3} chgVL:{4} chgBC:{5} mod:x{6}",
                            chgCC1, chgCC74, chgAT, chgPP, chgVL, chgBC, cc1mod);
                    }
                    //---------------------------------------------
                    // SendNore toggle
                    if (c.Key == ConsoleKey.T)
                    {
                        Console.WriteLine("");

                        enableSendNote = (!enableSendNote);
                        if (enableSendNote) Console.WriteLine("SendNote enabled");
                        else Console.WriteLine("SendNote disabled");

                    }

                    //===========================================
                }
            }
            finally
            {
                foreach (var device in inputList)
                {
                    device.ControlChange -= ControlChangeHandler;
                    device.NoteOn -= NoteOnHandler;
                    device.NoteOff -= NoteOffHandler;
                    device.PitchBend -= PitchBendHandler;
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
CCMapper3を起動したら、次に音源を立ち上げて入力MIDIデバイスを「loopMIDI port」に設定する。

ここで、wind_controlerで吹くと音が出る。
                                                                    
なお、色々な音源で必要と思われるCC#を有効にしているので、Ariaだけでなく、以下の音源でも、そのまま利用できる。多数のCC#が有効になっているが、特に問題がなければ、そのままで、かまわないが、それぞれのCC#をオフする機能がある。

1. Aria(USB-EWI)  
1. Lyrihorn-2(VST3)  
[Lyrihorn-2](https://www.davidsonaudioandmultimedia.com/products/lyrihorn-2)  
1. EVI-NER(VST3)  
[EVI-NER](https://www.davidsonaudioandmultimedia.com/products/evi-ner)  
1. IFW(VST3)  
1. Respiro  
[RESPIRO - Physical Modeling Wind Synth](https://www.imoxplus.com/site/)
1. TubeSynth(VST3)  
[TUBE SYNTH - VIRTUAL INSTRUMENTS](https://www.airmusictech.com/virtual-instruments/tubesynth.html)  
1. Surge XT  
[SURGE XT - Free & Open Source Hybrid Synthesizer](https://surge-synthesizer.github.io/)  
[Surge XT User Manual](https://surge-synthesizer.github.io/manual-xt/)  
1. Vital  
[VITAL - Spectral warping wavetable synth](https://vital.audio/)  
[Get Vital](https://vital.audio/#getvital)(フリー版もある)   


## 設定方法
起動時、実装されているCC＃が全て有効になっているので、大体の音源が、ブレスに対応して発音できる。特に実害がなければ、このままで良いが、キーボードのキーを押すことで該当のCC#(または、AT、PP)を有効/無効にできる。(トグル動作)  
またトランスポーズのキーがあり、オクターブ単位または半音単位で上下できる。  
有効/無効の切り替えはないが、PitchBendは、Wind_Controlerの出力がそのまま音源に転送される。

```
CC switches::
CC1(MW): [m] toggle
CC2(Breath Control): [b] toggle
CC7(Volume): [v] toggle
CC11(Expression): [x] toggle
CC74(CutoffFreq): [c] toggle
CC26(EqGain): [e] toggle
AT(Channel Pressure): [a] toggle
PP(Polyphonic Pressure): [p] toggle
OTHER CC: [o] toggle

Transpose:: 
[↑] [↓] +/- semitone
[←] [→] -/+ octave
```

通常は不要だが、Macの音源によってはMIDI入力が並列になっているものがあり、
その場合、NoteOn/Offが重複することになるので、その場合は、CCMapperとしては、NoteOn/Offを転送しないほうが良い場合がある。  
それを実現するために以下のスイッチがある：  
```
NoteOn/Off Tranfer Switch::
[t] toggle
```

## CCViewer
CC#などの値の状況を表示するプログラムで、特に必須ではないが、値の変化などを確認する際に使用する。

CCViewer/Program.cs
```c#
// CC Viewer
// 2022/12/15

using RtMidi.Core.Devices;
using RtMidi.Core.Messages;
using Serilog;
using System;
using System.Collections.Generic;

namespace RtMidi.Core.CCViewer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                //.WriteTo.ColoredConsole()
                .WriteTo.Console()
                //.MinimumLevel.Debug() // disp debug info.
                .CreateLogger();

            using (MidiDeviceManager.Default)
            {
                var p = new Program();
            }
        }

        public Program()
        {
            NoteOnMessage curMsg = new NoteOnMessage();

            string[] v = new string[128];

            bool enableOut = false; // true to transfer received messages to output device
            bool logOut = false; // true to disp log on console

            // the following device will be opened
            //string ID0 = "WIDI Bud Pro"; // for Windows
            string ID0 = "loopMIDI"; // for Windows
            string ID1 = "Elefue"; // for Mac
            string ID2 = "re.corder"; // for Mac
            string ID3 = "NuRad"; // for Mac
            //string OD = "loopMIDI"; // for Windows/Mac
            string OD = "WIDI Bud Pro"; // for Windows/Mac
            //string OD = "SE-0"; // for Mac

            // string[] for bar graph
            for (int n = 0; n < 128; n++)
            {
                if (127 == n) v[n] = new string('@', (int)(n / 2));
                else if (0 <= n & n < 13) v[n] = new string('0', (int)(n / 2));
                else if (13 <= n & n < 26) v[n] = new string('1', (int)(n / 2));
                else if (26 <= n & n < 39) v[n] = new string('2', (int)(n / 2));
                else if (39 <= n & n < 52) v[n] = new string('3', (int)(n / 2));
                else if (52 <= n & n < 65) v[n] = new string('4', (int)(n / 2));
                else if (65 <= n & n < 78) v[n] = new string('5', (int)(n / 2));
                else if (78 <= n & n < 91) v[n] = new string('6', (int)(n / 2));
                else if (91 <= n & n < 104) v[n] = new string('7', (int)(n / 2));
                else if (104 <= n & n < 117) v[n] = new string('8', (int)(n / 2));
                else if (117 <= n & n < 127) v[n] = new string('a', (int)(n / 2));

                //if (n != 127) v[n] = new string('+', (int)(n / 2));
                //else v[n] = new string('@', (int)(n / 2));

                //Console.WriteLine(v[n]);
            }
            //Thread.Sleep(40000);

            // keep value
            int vCC1 = 0;
            int vCC2 = 0;
            int vCC7 = 0;
            int vCC11 = 0;
            int vCC74 = 0;
            int vCC26 = 0;
            //  AT/PP added
            int vAT = 0;
            int vPP = 0;
            // Velocity added
            int vVel = 0;
            // Pitch Bend added
            int vPB = 0;

            var inputList = new List<IMidiInputDevice>();
            var outputList = new List<IMidiOutputDevice>();

            // List all available MIDI API's
            foreach (var api in MidiDeviceManager.Default.GetAvailableMidiApis())
                Console.WriteLine($"Available API: {api}");

            // Listen to all available midi devices
            void ControlChangeHandler(IMidiInputDevice sender, in ControlChangeMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] ControlChange: Channel:{msg.Channel} Control:{msg.Control} Value:{msg.Value}");
                if (enableOut) outputList[0].Send(msg);

                switch (msg.Control)
                {
                    case 1: vCC1 = msg.Value; break;
                    case 2: vCC2 = msg.Value; break;
                    case 7: vCC7 = msg.Value; break;
                    case 11: vCC11 = msg.Value; break;
                    case 74: vCC74 = msg.Value; break;
                    case 26: vCC26 = msg.Value; break;
                }
            }

            void NoteOnHandler(IMidiInputDevice sender, in NoteOnMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOn: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                if (enableOut) outputList[0].Send(msg);

                curMsg = msg;
                vVel = msg.Velocity;
            }

            void NoteOffHandler(IMidiInputDevice sender, in NoteOffMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOff: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                if (enableOut) outputList[0].Send(msg);

                // patch clear on NoteOff
                vCC1 = 0;
                vCC2 = 0;
                vCC7 = 0;
                vCC11 = 0;
                vCC74 = 0;
                vCC26 = 0;
                vAT = 0;
                vPP = 0;
                vVel = 0;

            }

            void ChannelPressureHandler(IMidiInputDevice sender, in ChannelPressureMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] AfterTouch: Channel:{msg.Channel} Pressure:{msg.Pressure}");
                if (enableOut) outputList[0].Send(msg);

                vAT = msg.Pressure;
            }

            void PolyphonicKeyPressureHandler(IMidiInputDevice sender, in PolyphonicKeyPressureMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] PolyphonicKeyPressure: Channel:{msg.Channel} Key:{msg.Key} Pressure:{msg.Pressure}");
                if (enableOut) outputList[0].Send(msg);

                vPP = msg.Pressure;
            }

            void PitchBendHandler(IMidiInputDevice sender, in PitchBendMessage msg)
            {
                //outputList[0].Send(new PitchBendMessage(msg.Channel, msg.Value));
                vPB = msg.Value;
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

                        inputDevice.ChannelPressure += ChannelPressureHandler; // AfterTouch
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.Open();

                        break;
                    }

                    if (inputDeviceInfo.Name.Contains(ID1))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler; // AfterTouch
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.Open();

                        break;
                    }

                    if (inputDeviceInfo.Name.Contains(ID2))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler; // AfterTouch
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.PitchBend += PitchBendHandler;

                        inputDevice.Open();

                        break;
                    }

                    if (inputDeviceInfo.Name.Contains(ID3))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.ChannelPressure += ChannelPressureHandler; // AfterTouch
                        inputDevice.PolyphonicKeyPressure += PolyphonicKeyPressureHandler;

                        inputDevice.PitchBend += PitchBendHandler;

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
                        //if (outputDeviceInfo.Name.Contains("bus1")) enableSendNote = false;
                        //if (!enableSendNote) Console.WriteLine("running at Mac Env.");
                        //else Console.WriteLine("running at Windows Env.");

                        var outputDevice = outputDeviceInfo.CreateDevice();
                        outputList.Add(outputDevice);

                        outputDevice.Open();
                    }
                }

                Console.WriteLine("CC Viewer");
                Console.WriteLine("Press 'q' key to stop...");
                while (true)
                {

                    Console.Clear();
                    Console.WriteLine("");

                    Console.WriteLine("CC1 :{0}", vCC1);
                    Console.WriteLine(v[vCC1]);
                    //Console.WriteLine("");

                    Console.WriteLine("CC2 :{0}", vCC2);
                    Console.WriteLine(v[vCC2]);
                    //Console.WriteLine("");

                    Console.WriteLine("CC7 :{0}", vCC7);
                    Console.WriteLine(v[vCC7]);
                    //Console.WriteLine("");

                    Console.WriteLine("CC11:{0}", vCC11);
                    Console.WriteLine(v[vCC11]);
                    //Console.WriteLine("");

                    Console.WriteLine("CC74:{0}", vCC74);
                    Console.WriteLine(v[vCC74]);
                    //Console.WriteLine("");

                    Console.WriteLine("CC26:{0}", vCC26);
                    Console.WriteLine(v[vCC26]);
                    //Console.WriteLine("");

                    Console.WriteLine("-----------------");

                    Console.WriteLine("AT:{0}", vAT);
                    Console.WriteLine(v[vAT]);
                    //Console.WriteLine("");

                    Console.WriteLine("PP:{0}", vPP);
                    Console.WriteLine(v[vPP]);
                    //Console.WriteLine("");

                    Console.WriteLine("-----------------");
                    Console.WriteLine("Vel:{0}", vVel);
                    Console.WriteLine(v[vVel]);
                    //Console.WriteLine("");

                    Console.WriteLine("PB:{0}", (vPB-8191));
                    int ix = (int)(127 * (vPB - 1) / 16382);
                    Console.WriteLine(v[ix]);
                    //Console.WriteLine("");


                    Console.WriteLine("=================");

                    Thread.Sleep(100);

                    /*
                    var c = Console.ReadKey();
                    if (c.Key == ConsoleKey.Q)
                    {
                        break;
                    }
                    */

                }

            }
            finally
            {
                foreach (var device in inputList)
                {
                    device.ControlChange -= ControlChangeHandler;
                    device.NoteOn -= NoteOnHandler;
                    device.NoteOff -= NoteOffHandler;

                    device.ChannelPressure -= ChannelPressureHandler; // AfterTouch
                    device.PolyphonicKeyPressure -= PolyphonicKeyPressureHandler;

                    device.PitchBend -= PitchBendHandler;

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

## 参考情報                                    
C#ビルド方法(参考)：  
[CCMapper(C#版/RtMidi)](https://xshigee.github.io/web0/md/CCMapper_CS_RtMidi.html)  

loopMIDI関連：  
[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
[[WS音源探訪02] Vital Free Patch for Windsynth つくってみました](https://note.com/windsynth/n/n247ac73351b8)  
wind_controler向けのパッチがあり役に立つ  
[[WS音源探訪01] Vital](https://note.com/windsynth/n/na3b11d4a4f8e)  
[【無料】VitalAudioのWaveTableシンセVitalの紹介](https://chilloutwithbeats.com/vitalaudio-wavetable-vital-intro/)  
[Macことはじめ/仮想MIDIデバイスの設定,Bluetooth_MIDIデバイスの接続](https://xshigee.github.io/web0/md/Mac_beginner.html)  
[Respiro(VST3)を使ってみる](https://xshigee.github.io/web0/md/Respiro.html)  
[Lyrihorn 2(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_Lyrihorn-2.html)  
[EVI-NER(VST3)を使ってみる](https://xshigee.github.io/web0/md/re.corder_EVI-NER.html)  
[re.corder/Elefueに外部音源(Aria/Windows)を接続する(WIDI_Bud_Pro経由)](https://xshigee.github.io/web0/md/re.corder_Aria.html)  
[EWI5000をソフト音源(IFW)と接続する](https://xshigee.github.io/web0/md/EWI5000_IFW.html)  

re.corder関連：  
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  
[re.corder Downloads](https://www.recorderinstruments.com/en/support-downloads/)  
[re.corder Frequently Asked Questions](https://www.recorderinstruments.com/en/frequently-asked-questions/)    

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Midi View](https://hautetechnique.com/midi/midiview/)  

ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

