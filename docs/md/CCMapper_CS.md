    
# CCMapper(C#版)  

2022/11/7      
初版    
  
## 概要    
「[openFrameworksでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_ofx.html)」の続編として、CCMaperをC#(windows版)で実装した。  
なお、記事として独立して読めるように前の記事の情報を含めた。


## 準備

1.以下のC#のMIDIライブラリをダウンロードして解凍する；


http://www.chrofieyue.net/nextmidi.zip  


2.VisualStudio  

[visual studio setup guide](https://openframeworks.cc/setup/vs/)  

上の説明から以下のurlからダウンロード&インストールする：  

[https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)  

今回、使用するのはC#だが、通常(C++)のVisualStudioがインストール済みであれば、必要なときに自動的にC#のツールがインストールされる。

## C\#プロジェクト作成    
VisualStudioを起動する：  

1.新しいプロジェクトを作成する  
(1)テンプレート選択  
そのときのテンプレートは  
「コンソールアプリ(.NET Framework)」を選択する。    
\#「(.NET Framework)」無しの「コンソールアプリ」もあるので  
\# 間違えて、それを選択しないように！  

(2)プロジェクト名を入力する。  
任意だが今回は「CCMapper_CS」にする。  

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

3.参照を追加する  
画面の右側のソリューション・エクスプローラーの画面の[参照]を右クリックして    
[参照の追加]を選択してダウンロードして解凍した.dllを選択して取り込む。  

ダウンロードして、その場で解凍した場合、以下のディレクトリに置いてある：  
C:\\Users\\＜ユーザー名＞\\Downloads\\nextmidi\\Package

3,ビルド  
メニューから
[ビルド/xxxをビルド]を選択してビルドする。  

4.実行  
右矢印アイコンをクリックして実行する  
または   
[デバッグ/デバッグなしで開始]で実行する   


## CCMapper(source code)

以下が今回のソースコードになる。  

CCMapper_CS/Program.cs
```cs

// CCMapper_CS 2022/11/7
using System;
using NextMidi.DataElement;
using NextMidi.MidiPort.Output;
using NextMidi.MidiPort.Input.Core;
using NextMidi.MidiPort.Input;
using Avenue;
using NextMidi.MidiPort.Output.Core;

namespace CCMapper_CS
{
    public class Program
    {
        static void EnumInput()
        {
            int count = MidiInPortHandle.PortCount;
            for (int i = 0; i < count; i++)
            {
                Console.WriteLine(MidiInPortHandle.GetPortInformation(i).szPname);
            }
        }

        static void EnumOutput()
        {
            int count = MidiOutPortHandle.PortCount;
            for (int i = 0; i < count; i++)
            {
                Console.WriteLine(MidiOutPortHandle.GetPortInformation(i).szPname);
            }
        }

        static void Main(string[] args)
        {
            // disp MIDI device list
            Console.WriteLine("Input MIDI devices:");
            EnumInput();
            Console.WriteLine();
            Console.WriteLine("Output MIDI devices:");
            EnumOutput();
            Console.WriteLine();
            //-------------------------------------------

            // change device to fit your env.
            var inport = new MidiInPort("WIDI Bud Pro");
            var outport = new MidiOutPort("loopMIDI Port 1");

            void MidiReceived(object sender, DataEventArgs<MidiEvent> e)
            {
                byte[] data = e.Value.ToNativeEvent(); //MIDI data to byte[]

                // output MIDI log
                Console.Write("{0:d} {1:d} {2:d}\n", data[0], data[1], data[2]);

                if (data[0] == 144)
                {
                    outport.Send(new NoteOnEvent(data[1], data[2]));
                    return;
                }
                if (data[0] == 128)
                {
                    outport.Send(new NoteOffEvent(data[1]));
                    return;
                }
                if (data[0] == 176) // ControlChange
                {
                    if (data[1] == 7 || data[1] == 11) // volume, expression
                    {
                        // for Aria
                        outport.Send(new ControlEvent(ControlNumber.BreathControl, data[2]));
                        outport.Send(new ControlEvent(ControlNumber.Volume, data[2]));
                        outport.Send(new ControlEvent(26, data[2]));
                        return;
                    }
                    else if (data[1] == 1) // modulation
                    {
                        outport.Send(new ControlEvent(ControlNumber.Modulation, data[2]));
                        return;
                    }
                    else
                    {
                        outport.Send(new ControlEvent(data[1], data[2]));
                        return;
                    }
                }
            }

            // try input device
            try
            {
                inport.Open();
            }
            catch
            {
                Console.WriteLine("no such INPUT port exists");
                return;
            }

            // set event listener
            inport.Received += MidiReceived;

            // try outout device
            try
            {
                outport.Open();
            }
            catch
            {
                Console.WriteLine("no such OUTPUT port exists");
                return;
            }

            // wait for event
            while (true) { }

        }
    }
}

```

以下の部分は実行環境に依存しているので  
自分の環境に合わせて変更すること：  

```cs

            // change device to fit your env.
            var inport = new MidiInPort("WIDI Bud Pro");
            var outport = new MidiOutPort("loopMIDI Port 1");

```

ウィンド・コントローラの入力データをコンソール表示するようになっているので、煩雑であるならば、以下の部分をコメントアウトすること：  
```cs

                // output MIDI log
                Console.Write("{0:d} {1:d} {2:d}\n", data[0], data[1], data[2]);
```


## 実行
VisualStudioから実行するとコンソール画面が現れて以下のような表示になる。

コンソール出力例
```
Input MIDI devices:
loopMIDI Port 1
WIDI Bud Pro

Output MIDI devices:
CoolSoft MIDIMapper
Microsoft GS Wavetable Synth
VirtualMIDISynth #1
loopMIDI Port 1
WIDI Bud Pro
```
上のように接続している入力MIDIデバイス、出力MIDIデバイスが表示される。

MIDI接続状況：  
MIDIとしての接続は「[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)」と同じ接続にする。

## 問題点 
ウィンド・コントローラを接続して吹いていると、ときどき、
「ハンドルされていない例外: System.NullReferenceException: オブジェクト参照がオブジェクト インスタンスに設定されていません。」が出ることがある。  
今のところ原因不明。  

## 参考：テストプログラム 

MIDIoutTest/Program.cs
```cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using NextMidi.DataElement;
using NextMidi.MidiPort.Output;

namespace MIDIoutTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            /*
            // MIDI ポート名を指定して MIDI ポートを開く
            if (args.Length != 1)
            {
                Console.WriteLine("1 port name required");
                return;
            }
            var port = new MidiOutPort(args[0]);
            */
            var port = new MidiOutPort("loopMIDI Port 1");
            try
            {
                port.Open();
            }
            catch
            {
                Console.WriteLine("no such port exists");
                return;
            }

            // Program No.5 に切り替え
            port.Send(new ProgramEvent(4));

            // 500 ミリ秒待つ
            Thread.Sleep(500);

            // ドレミファソラシド
            foreach (byte n in new byte[8] { 60, 62, 64, 65, 67, 69, 71, 72 })
            {
                // ベロシティ 112 でノートオンを送信
                port.Send(new NoteOnEvent(n, 112));
                Thread.Sleep(n != 72 ? 500 : 1500);
                port.Send(new NoteOffEvent(n));
            }
        }
    }
}
```


## 関連情報  
CCMapper関連：  
[CCMapper改良版(openFrameworks)](https://xshigee.github.io/web0/md/CCMapper2_improved_ofx.html)  
[processingでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_processing.html)  
[python版CCMapper - re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)  

C#MIDI関連：  
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

