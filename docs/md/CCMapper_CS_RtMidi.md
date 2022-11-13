    
# CCMapper(C#版/RtMidi)  

2022/11/13      
初版    
  
## 概要     
「[CCMapper(C#版)](https://xshigee.github.io/web0/md/CCMapper_CS.html)」のMIDIライブラリはWindows用だったので、クロスプラットフォームのMIDIライブラリのRtMidiを採用したものに変更した。  
これにより、WindowsとMacで動作するようになる。


## 準備
以下のツールをインストールする.

・Mac用VisualStudio  

「[Visual Studio for Mac](https://visualstudio.microsoft.com/ja/vs/mac/)」からダウンロードしてインストールする。
  

・Windows用VisualStudio  

[visual studio setup guide](https://openframeworks.cc/setup/vs/)  

上の説明から以下のurlからダウンロード&インストールする：  

[https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)  

今回、使用するのはC#だが、通常(C++)のVisualStudioがインストール済みであれば、必要なときに自動的にC#のツールがインストールされる。

## C\#プロジェクト作成    
VisualStudioを起動する：  
Windows用とMac用では若干操作性が異なるが、ここではWindows用のもので説明する。  

1.新しいプロジェクトを作成する  
(1)テンプレート選択  
そのときのテンプレートは  
「コンソールアプリ」を選択する。    

(2)プロジェクト名を入力する。  
任意だが今回は「CCMapper_CS_RtMidi」にする。  

(3)場所  
デフォルトでかまわない。
C:\\Users\\＜ユーザー名＞\\source\\repos  

(4)[ソリューションとプロジェクトを同じディレクトリに配置する(D)]に
チェックを入れる。

(5)フレームワーク  
フレームワークはデフォルトで構わない。  
.NET Framewok 4.7.2  


(6)[作成]をクリックする

2.プログラムを入力する  
上の操作で、雛形のプログラムが出来ているので、それを利用して、新しくプログラムを入力する。  
今回は次節にあるものを入力する。

3.ライブラリを追加する  
1. [プロジェクト(P)/NuGetパッケージの管理]に入る   
1. NuGetパッケージマネージャー画面が出現する
1. [参照]タブに切り替えて以下の２つのライブラリを検索してインストールする    
・RtMidi.Core  
・Serilog.Sinks.Console  
状況によっては同意を促す画面が出てる場合、[同意]をクリックする。  

3,ビルド  
メニューから[ビルド(B)/xxxのビルド]を選択してビルドする。  

4.実行  
右矢印アイコンをクリックして実行する  
または   
[デバッグ/デバッグなしで開始]で実行する   


## CCMapper(source code)

以下が今回のソースコードになる。  

CCMapper_CS_RtMidi/Program.cs
```cs

// CCMapper(RiMidi)
// 2022/11/13

using System;
using System.Collections.Generic;
using RtMidi.Core.Devices;
using RtMidi.Core.Messages;
using Serilog;

namespace RtMidi.Core.CCMapper
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
            bool logOut = true; // true to disp log on console

            // the following device will be opened
            string ID = "WIDI Bud Pro"; // for Windows
            //string ID = "Elefue"; // for Mac
            //string ID = "re.corder"; // for Mac
            string OD = "loopMIDI"; // for Windows/Mac

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
                    outputList[0].Send(new ControlChangeMessage(msg.Channel, 2, msg.Value));
                    outputList[0].Send(new ControlChangeMessage(msg.Channel, 7, msg.Value));
                    outputList[0].Send(new ControlChangeMessage(msg.Channel, 26, msg.Value));
                }
                else outputList[0].Send(msg);
            }

            void NoteOnHandler(IMidiInputDevice sender, in NoteOnMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOn: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                outputList[0].Send(msg);
            }

            void NoteOffHandler(IMidiInputDevice sender, in NoteOffMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOff: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                outputList[0].Send(msg);
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
                    if (inputDeviceInfo.Name.Contains(ID))
                    {
                        Console.WriteLine($"Opening input:[{inputDeviceInfo.Name}]");

                        var inputDevice = inputDeviceInfo.CreateDevice();
                        inputList.Add(inputDevice);

                        inputDevice.ControlChange += ControlChangeHandler;
                        inputDevice.NoteOn += NoteOnHandler;
                        inputDevice.NoteOff += NoteOffHandler;

                        inputDevice.Open();
                    }
                }
                foreach (var outputDeviceInfo in MidiDeviceManager.Default.OutputDevices)
                {
                    // one device only
                    if (outputDeviceInfo.Name.Contains(OD))
                    {
                        Console.WriteLine($"Opening output:[{outputDeviceInfo.Name}]");

                        var outputDevice = outputDeviceInfo.CreateDevice();
                        outputList.Add(outputDevice);

                        outputDevice.Open();
                    }
                }

                Console.WriteLine("Press 'q' key to stop...");
                while (true)
                {
                    if (Console.ReadKey().Key == ConsoleKey.Q)
                    {
                        break;
                    }
                }
            }
            finally
            {
                foreach (var device in inputList)
                {
                    device.ControlChange -= ControlChangeHandler;
                    device.NoteOn -= NoteOnHandler;
                    device.NoteOff -= NoteOffHandler;
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

1.以下の部分は実行環境(入力デバイスなど)に依存しているので、自分の環境に合わせて変更すること：  

```cs
            // the following device will be opened
            string ID = "WIDI Bud Pro"; // for Windows
            //string ID = "Elefue"; // for Mac
            //string ID = "re.corder"; // for Mac
            string OD = "loopMIDI"; // for Windows/Mac
```

2.ウィンド・コントローラの入力データをコンソール表示するようになっているので、煩雑であるならば、以下の部分をfalseすること：  
```cs
            bool logOut = true; // true to disp log on console
```

3.Mac向けの変更として以下のように送信部分をコメントアウトする：   
使用しているソフト音源のよると思うが入力デバイスを１つに絞ることができず、CCMapperの出力とウィンド・コントローラの入力のデータが混在して届く。  
NoteOn/NoteOffがダブって音源に入力されるので、音がダブって鳴ることになる。それを回避するための変更になる。  
\# 他のControlChangeのデータは、そのデータの性質上、ダブっても、あまり影響ない。  

```cs
            void NoteOnHandler(IMidiInputDevice sender, in NoteOnMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOn: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                //outputList[0].Send(msg);
            }

            void NoteOffHandler(IMidiInputDevice sender, in NoteOffMessage msg)
            {
                if (logOut) Console.WriteLine($"[{sender.Name}] NoteOff: Channel:{msg.Channel} Key:{msg.Key} Velocity:{msg.Velocity}");
                //outputList[0].Send(msg);
            }
```

## 実行
VisualStudioから実行するとコンソール画面が現れて以下のような表示になる。

コンソール出力例(Windows版)
```                       
Available API: RT_MIDI_API_WINDOWS_MM
---- INPUT DEVICE ----
loopMIDI Port 1
WIDI Bud Pro
---- OUTPUT DEVICE ----
CoolSoft MIDIMapper
Microsoft GS Wavetable Synth
VirtualMIDISynth #1
loopMIDI Port 1
WIDI Bud Pro
-----------------------
Opening input:[WIDI Bud Pro ]
Opening output:[loopMIDI Port 1 ]
Press 'q' key to stop...
[WIDI Bud Pro ] NoteOff: Channel:Channel1 Key:Key0 Velocity:0
[WIDI Bud Pro ] NoteOn: Channel:Channel1 Key:Key79 Velocity:100
[WIDI Bud Pro ] ControlChange: Channel:Channel1 Control:11 Value:53
[WIDI Bud Pro ] NoteOff: Channel:Channel1 Key:Key79 Velocity:0
[WIDI Bud Pro ] ControlChange: Channel:Channel1 Control:11 Value:0
...
...
```

コンソール出力例(Mac版)
```                       
Available API: RT_MIDI_API_MACOSX_CORE
---- INPUT DEVICE ----
loopMIDI bus1
Elefue Bluetooth
---- OUTPUT DEVICE ----
loopMIDI bus1
Elefue Bluetooth
-----------------------
Opening input:[Elefue Bluetooth]
Opening output:[loopMIDI bus1]
Press 'q' key to stop...
[Elefue Bluetooth] NoteOff: Channel:Channel1 Key:Key0 Velocity:0
[Elefue Bluetooth] NoteOn: Channel:Channel1 Key:Key79 Velocity:100
...
...
```

上のように接続している入力MIDIデバイス、出力MIDIデバイスが表示される。

MIDI接続状況：  
MIDIとしての接続は「[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)」と同じ接続にする。

## Macでの仮想MIDIデバイスの設定  
WindowsのloopMIDIと同じような機能を仮想MIDIデバイスとして実現できる：   

「[仮想MIDIバスの設定する](https://help.ableton.com/hc/ja/articles/209774225-%E4%BB%AE%E6%83%B3MIDI%E3%83%90%E3%82%B9%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)」の参考にして、以下のように設定する。(日本語にするとトラブルのもとになるので英数のみとすること)

[装置はオンライン]：チェックオン  
装置名：loopMIDI  
ポート：bus1  

## Macでのウィンド・コントローラ(Bluetooth MIDI)の接続

「[Bluetooth MIDI 接続ガイド](https://cdn.korg.com/jp/support/download/files/66bd712c7c4ca40c46fa26cf1ad97b8e.pdf)」の「■ Mac との接続/OS X Yosemiteの場合」を参照のこと。

## [参考]dotnetによるビルド
VisualStudioをインストールしていなくても  
dotnetがインストールしてあれば、以下の手順でビルドできる：  
```bash

dotnet new console -o CCMapper_CS_RtMidi

cd CCMapper_CS_RtMidi/
code Program.cs

dotnet add package RtMidi.Core -s https://www.nuget.org/api/v2
dotnet add package Serilog.Sinks.Console -s https://www.nuget.org/api/v2

dotnet build
dotnet run

```


## 関連情報  
CCMapper関連：  
[CCMapper改良版(openFrameworks)](https://xshigee.github.io/web0/md/CCMapper2_improved_ofx.html)  
[processingでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_processing.html)  
[python版CCMapper - re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)  

C#MIDI関連：  
[RtMidi.Core/github](https://github.com/micdah/RtMidi.Core)  
[RtMidi.Core/nuget](https://www.nuget.org/packages/RtMidi.Core/)  

[Next MIDI](http://starway.s234.xrea.com/wordpress/?page_id=247)  
[.NET Global exception handler in console application](https://stackoverflow.com/questions/3133199/net-global-exception-handler-in-console-application)  
[C#でMIDI通信を扱うNext MIDI Projectで受信する](https://qiita.com/gpsnmeajp/items/c90acfdcca2eab02fa04)  

openframework関連：   
[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/create-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
[Novation LauchpadとopenFrameworksを使ってResolumeのVJコントローラを作る : コーディング編](https://artteknika.hatenablog.com/entry/2016/09/30/223230)  
[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)   
[新規プロジェクトの作成](https://openframeworks.cc/ja/learning/01_basics/create_a_new_project/)  
[Listen to events](https://openframeworks.cc/learning/06_events/event_example_how_to/)  
[変数の値を見る](https://openframeworks.cc/ja/learning/01_basics/how_to_view_value/)  
[ofLog](https://openframeworks.cc/documentation/utils/ofLog/)  
[openFrameworks-コンソール表示する](https://qiita.com/y_UM4/items/99c875a7a32056d006b5)  
[oF：Windowsのopenframeworksでコンソールウインドウを出さない方法](http://wishupon.me/?p=312)  
[openFrameworks-Log vol.1／環境設定と導入](https://barbegenerativediary.com/tutorials/openframeworks-log-1-setup/)  
[openFramewoks – OSC (Open Sound Control) を利用したネットワーク連携](https://yoppa.org/ma2_10/2279.html)  
                                   
pygame.midi関連：  
[PythonでMIDI](https://webmidiaudio.com/npage507.html)  
[pygame.midi](https://runebook.dev/ja/docs/pygame/ref/midi)   

loopMIDI関連：  
 [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  
[loopMIDIでつなぐ](https://webmidiaudio.com/npage501.html)  

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

PC音源関連：  
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
