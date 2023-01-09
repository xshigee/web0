    
# CCMapper(NAudio.Midi) for Windows

2023/1/9      
初版    
  
## 概要    

re.corder/Elefue/EWI5000などのWind_ControlerをWIDI_Bud_Pro経由(Winの場合)で外部音源を接続する際、特にElefueは送信するCC#が11に固定されていてブレスによるコントロールが外部音源(Ariaなど)に反映できず表現力に乏しい。  
これを解決するためにリアルタイムでCC#2またはCC#11を受信して、CC#を任意のもの(複数)に変更するCCMapperをC#で実装した。(Pitch Bendは、そのまま受けて外部音源に送る)  
今回のものは、ライブラリとして、NAudio.Midiを使用して、windows専用となる。

## 準備
1.Windowsの場合、  
仮想MIDIデバイスとして、loopMIDIがインストールされている必要がある。  
参照：[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)  

MIDI信号の流れとしては以下のようになる：
```
[wind_controler(re.corder/Elfue etc)]→[WIDI Bud Pro]→(CCMapper3)→[loopMIDI]→ [PC音源]
```

## 使用ライブラリ
以下のライブラリをNuGetマネージャーでインストールしてプログラムに組み込む：  
```
NAudio.Midi
```

## CCMapper
CCMapperのプログラムとしては以下を使用する：  

CCMapper_NAudio_Midi/Program.cs  
```c#

// CCMapper_NAudioMidi for windows only

// 2023/1/8
// written by: xshige

//------------------
// 2023/1/8

// z PANIC

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

// OTHER CC
// o toggle

//---------------------------------


// related URLs
/*
http://truelogic.org/wordpress/2021/01/28/using-midi-with-naudio/
https://github.com/naudio/NAudio/blob/master/NAudio.Midi/Midi/MidiEvent.cs
https://github.com/naudio/NAudio/blob/master/NAudio.Midi/Midi/MidiOut.cs
https://github.com/naudio/NAudio/blob/master/NAudio.Midi/Midi/ChannelAfterTouchEvent.cs
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NAudio.Midi;

namespace CCMapper_NAudioMidi

{
    class Program
    {

        // the following device will be opened
        const string ID0 = "WIDI Bud"; // for Windows (Elefue,re.corder)
        const string ID1 = "Nu"; // for USB-MIDI (NuRAD,NuEVI)
        const string ID2 = "EWI"; // for USB-MIDI (EWI5000)
        const string ID3 = "AE-"; // for USB-MIDI (Roland)
        const string ID4 = "YDS-"; // for USB-MIDI (YAMAHA)
        const string OD = "loopMIDI"; // for Windows
        //string OD = "SE-0"; // for USB-MIDI

        // the followings are forked from ofxMidi
        // channel voice messages
        const byte MIDI_NOTE_OFF = 0x80;
        const byte MIDI_NOTE_ON  = 0x90;
        const byte MIDI_CONTROL_CHANGE = 0xB0;
        const byte MIDI_PROGRAM_CHANGE = 0xC0;
        const byte MIDI_PITCH_BEND = 0xE0;
        const byte MIDI_AFTERTOUCH = 0xD0; // aka channel pressure
        const byte MIDI_POLY_AFTERTOUCH = 0xA0; // aka key pressure

        // system messages
        const byte MIDI_SYSEX  = 0xF0;
        const byte MIDI_TIME_CODE = 0xF1;
        const byte MIDI_SONG_POS_POINTER = 0xF2;
        const byte MIDI_SONG_SELECT = 0xF3;
        const byte MIDI_TUNE_REQUEST = 0xF6;
        const byte MIDI_SYSEX_END = 0xF7;
        const byte MIDI_TIME_CLOCK = 0xF8;
        const byte MIDI_START = 0xFA;
        const byte MIDI_CONTINUE = 0xFB;
        const byte MIDI_STOP = 0xFC;
        const byte MIDI_ACTIVE_SENSING = 0xFE;
        const byte MIDI_SYSTEM_RESET = 0xFF;
        //----------------------------------

        static int transpose = 0;
        static int curPitch = 0;
        static int curVelocity = 0;
        static int fixedVelocity = 77;

        static bool fCC1 = false;
        static bool fCC2 = true;
        static bool fCC7 = true;
        static bool fCC11 = true;
        static bool fCC74 = true;
        static bool fCC26 = true;
        //static bool fCC52 = false;
        static bool fAT = true;
        static bool fPP = true;
        static bool fVFIXED = false;
        static bool fPB_THRU = true;

        static bool fXfer = true; // NoteOn/NoteOff transfer

        static bool fOTHER = false;


        //-------------------------------------------

        static int mInDeviceIndex = -1;
        static int mOutDeviceIndex = -1;
        static MidiIn? mMidiIn;
        static MidiOut? mMidiOut;
   
        static void Main(string[] args)
        {
            listDevices();
            openDevices();
            mMidiIn = new MidiIn(mInDeviceIndex);
            mMidiOut = new MidiOut(mOutDeviceIndex);

            handleMidiMessages();

            Console.WriteLine("---------------------");
            Console.WriteLine("CCMaper(NAudio.Midi) for windows");
            Console.WriteLine("MW(CC1)/BC/VL/EX/CF(CC74)/CC26/AT(CP/PP)/other/Tranpose PitchBend_xfer support version");
            Console.WriteLine("Press 'q' key to stop...");
            
            while (true)
                {
                    var c = Console.ReadKey();
                    if (c.Key == ConsoleKey.Q)
                    {
                        break;
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
                     
                        transpose -= 12;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    if (c.Key == ConsoleKey.RightArrow)
                    {
                    
                        transpose += 12;

                        Console.WriteLine("trans:{0}", transpose);
                    }
                    //----------------------------------------
                    if (c.Key == ConsoleKey.A)
                    {
                        Console.WriteLine("");

                        fAT = (!fAT);
                        if (fAT) Console.WriteLine("AT(CP) enabled");
                        else Console.WriteLine("AT(CP) disabled");

                    }
                    if (c.Key == ConsoleKey.C)
                    {
                        Console.WriteLine("");

                        fCC74 = (!fCC74);
                        if (fCC74) Console.WriteLine("CF(CC74) enabled");
                        else Console.WriteLine("CF(CC74) disabled");

                    }
                    if (c.Key == ConsoleKey.M)
                    {
                        Console.WriteLine("");

                        fCC1 = (!fCC1);
                        if (fCC1) Console.WriteLine("MW(CC1) enabled");
                        else Console.WriteLine("MW(CC1) disabled");

                    }
                    if (c.Key == ConsoleKey.P)
                    {
                        Console.WriteLine("");

                        fPP = (fPP);
                        if (fPP) Console.WriteLine("AT(PP) enabled");
                        else Console.WriteLine("AT(PP) disabled");

                    }
                    if (c.Key == ConsoleKey.B)
                    {
                        Console.WriteLine("");

                        fCC2 = (!fCC2);
                        if (fCC2) Console.WriteLine("BC(CC2) enabled");
                        else Console.WriteLine("BC(CC2) disabled");

                    }
                    if (c.Key == ConsoleKey.V)
                    {
                        Console.WriteLine("");

                        fCC7 = (!fCC7);
                        if (fCC7) Console.WriteLine("VL(CC7) enabled");
                        else Console.WriteLine("VL(CC7) disabled");

                    }
                    if (c.Key == ConsoleKey.E)
                    {
                        Console.WriteLine("");

                        fCC26 = (!fCC26);
                        if (fCC26) Console.WriteLine("CC26 enabled");
                        else Console.WriteLine("CC26 disabled");

                    }
                    if (c.Key == ConsoleKey.X)
                    {
                        Console.WriteLine("");

                        fCC11 = (!fCC11);
                        if (fCC11) Console.WriteLine("EX(CC11) enabled");
                        else Console.WriteLine("EX(CC11) disabled");

                    }
                    if (c.Key == ConsoleKey.O)
                    {
                        Console.WriteLine("");

                        fOTHER = (!fOTHER);
                        if (fOTHER) Console.WriteLine("Other enabled");
                        else Console.WriteLine("Other disabled");

                    }
                    // 2023/1/5
                    if (c.Key == ConsoleKey.D)
                    {
                        Console.WriteLine("");

                        fPB_THRU = (!fPB_THRU);
                        if (fPB_THRU) Console.WriteLine("PB Thru enabled");
                        else Console.WriteLine("PB Thru disabled");

                    }
                    if (c.Key == ConsoleKey.I)
                    {
                        Console.WriteLine("");

                        fVFIXED = (!fVFIXED);
                        if (fVFIXED) Console.WriteLine("Velocity Fixed");
                        else Console.WriteLine("Velociry Dynamic");
                    }
                    //---------------------------------------------
                    // SendNote toggle
                    if (c.Key == ConsoleKey.T)
                    {
                        Console.WriteLine("");

                        fXfer = (!fXfer);
                        if (fXfer) Console.WriteLine("SendNote Xfer enabled");
                        else Console.WriteLine("SendNote Xfer disabled");

                    }
                //===========================================
                // 2023/1/8
                // PANIC 
                if (c.Key == ConsoleKey.Z)
                {
                    Console.WriteLine("");

                    // All Note Off
                    sendMsg(MIDI_CONTROL_CHANGE | 0, 123, 0);
                    // All Sound Off
                    sendMsg(MIDI_CONTROL_CHANGE | 0, 120, 0);
                    
                    Console.WriteLine("PANIC done");
                }
            }// while

            // Terminate All
            mMidiIn.Stop();
            mMidiIn.Dispose();
            mMidiOut.Dispose();
        }

        public static void sendMsg(int data0, int data1, int data2)
        {
            var oMessage = data2;
            oMessage = (oMessage << 8) | (0xFF & data1);
            oMessage = (oMessage << 8) | (0xFF & data0);

            mMidiOut.Send(oMessage);
        }

        public static void listDevices()
        {
            Console.WriteLine("MIDI In Devices:");
            for (int device = 0; device < MidiIn.NumberOfDevices; device++)
            {
                Console.WriteLine(MidiIn.DeviceInfo(device).ProductName);
            }
            Console.WriteLine("---------------------");
 
            Console.WriteLine("MIDI Out Devices:");
            for (int device = 0; device < MidiOut.NumberOfDevices; device++)
            {
                Console.WriteLine(MidiOut.DeviceInfo(device).ProductName);
            }
            Console.WriteLine("---------------------");
        }

        public static void openDevices()
        {
  
            for (int device = 0; device < MidiIn.NumberOfDevices; device++)
            {
                if (MidiIn.DeviceInfo(device).ProductName.Contains(ID0))
                {
                    mInDeviceIndex = device;
                    break;
                }

                if (MidiIn.DeviceInfo(device).ProductName.Contains(ID1))
                {
                    mInDeviceIndex = device;
                    break;
                }
                if (MidiIn.DeviceInfo(device).ProductName.Contains(ID2))
                {
                    mInDeviceIndex = device;
                    break;
                }
                if (MidiIn.DeviceInfo(device).ProductName.Contains(ID3))
                {
                    mInDeviceIndex = device;
                    break;
                }
                if (MidiIn.DeviceInfo(device).ProductName.Contains(ID4))
                {
                    mInDeviceIndex = device;
                    break;
                }
            }
            Console.WriteLine("Input Device: " + MidiIn.DeviceInfo(mInDeviceIndex).ProductName);

            for (int device = 0; device < MidiOut.NumberOfDevices; device++)
            {
                if (MidiOut.DeviceInfo(device).ProductName.Contains(OD))
                {
                    mOutDeviceIndex = device;
                    break;
                }

            }
            Console.WriteLine("Output Device: " + MidiOut.DeviceInfo(mOutDeviceIndex).ProductName);
        }

        public static void handleMidiMessages()
        {
            mMidiIn.MessageReceived += midiIn_MessageReceived;
            mMidiIn.ErrorReceived += midiIn_ErrorReceived;
            mMidiIn.Start();
        }

        static void midiIn_ErrorReceived(object sender, MidiInMessageEventArgs e)
        {
            Console.WriteLine(String.Format("Time {0} Message 0x{1:X8} Event {2}",
                e.Timestamp, e.RawMessage, e.MidiEvent));
        }

        static void midiIn_MessageReceived(object sender, MidiInMessageEventArgs e)
        {
            //Console.WriteLine(String.Format("Time {0} Message 0x{1:X8} Event {2}",
            //    e.Timestamp, e.RawMessage, e.MidiEvent));

            var rawMessage = e.RawMessage;
            int data0 = rawMessage & 0xFF;
            int status = data0 & 0xF0;
            int ch = data0 & 0x0F;
            int data1 = (rawMessage >> 8) & 0xFF;
            int data2 = (rawMessage >> 16) & 0xFF;

            //Console.WriteLine(String.Format("0x{0:x} {1} {2}", data0, data1, data2));


            if (status == MIDI_NOTE_OFF)
            {
                if (fXfer) sendMsg(MIDI_NOTE_OFF | ch, curPitch + transpose, 0);
                return;
            }
            else if (status == MIDI_NOTE_ON)
            {
                curPitch = data1;
                curVelocity = data2;
                if (fXfer)
                {
                    if (fVFIXED)
                    {
                        sendMsg(MIDI_NOTE_ON | ch, curPitch + transpose, fixedVelocity);
                        return;
                    }
                    else
                    {
                        sendMsg(MIDI_NOTE_ON | ch, curPitch + transpose, curVelocity);
                        return;
                    }
                }
            }

            else if (status == MIDI_CONTROL_CHANGE)
            {
                if (data1 == 1)
                { // modulation wheel
                    if (!fCC1) sendMsg(MIDI_CONTROL_CHANGE | ch, 1, data2); //midi.sendCtlChange(ch, 1, e.data[2]);
                    return;
                }
                if (data1 == 11 || data1 == 2)
                {
                    if (fCC1) sendMsg(MIDI_CONTROL_CHANGE | ch, 1, data2);
                    if (fCC2) sendMsg(MIDI_CONTROL_CHANGE | ch, 2, data2);
                    if (fCC7) sendMsg(MIDI_CONTROL_CHANGE | ch, 7, data2);
                    if (fCC11) sendMsg(MIDI_CONTROL_CHANGE | ch, 11, data2);
                    if (fCC74) sendMsg(MIDI_CONTROL_CHANGE | ch, 74, data2);
                    if (fCC26) sendMsg(MIDI_CONTROL_CHANGE | ch, 26, data2);
                    // AT(CP)
                    if (fAT) sendMsg(MIDI_AFTERTOUCH | ch, data2, 0);
                    // AT(PP)
                    if (fPP) sendMsg(MIDI_POLY_AFTERTOUCH | ch, transpose + curPitch, data2);
                    return;
                }
                else
                {
                    // the following CC#s ignored(will not transfer)
                    // case of EWI5000/EWI Solo 
                    if (data1 == 7) return; // CC#7(volume) ignored 
                    if (data1 == 5) return; // CC#5(portament) ignore
                    if (data1 == 34) return; // CC#34(Hires/Breath Controler) ignored
                    if (data1 == 39) return; // CC#39(Hires/Volume) ignored (solo only?)
                    if (data1 == 43) return; // CC#43(Hires/Expression) ignored (solo only?)
                    //
                    if (data1 == 65) return; // CC#65(Portament) ignored
                    if (data1 == 66) return; // CC#66(Sostenuto) ignored
                    if (data1 == 68) return; // CC#68(Legate) ignored
                    if (data1 == 74) return; // CC#74(cutoff freq) ignored
                    if (data1 == 88) return; // CC#88(Hires/NoteOn) ignored
                    if (data1 == 102) return; // ignored
                    if (data1 == 103) return; // ignored
                    if (data1 == 104) return; // CC#104(legate time) ignored
                    // Roland AE-20
                    if (data1 == 32) return; // CC#32(Bank Select LSB) ignored
                    //
                    //get("vXX").value = data1; // control#
                    //get("vCCxx").value = data2; // values
                    if (fOTHER) sendMsg(data0, data1, data2); 
                    return;
                }
            }
 
            else if (status == MIDI_PITCH_BEND)
            {
                if (fPB_THRU) sendMsg(MIDI_PITCH_BEND | ch, data1, data2);
                /*
                var int14 = data2; // 2nd byte
                int14 <<= 7;
                int14 |= data1;
                if (fUpdate) get("PB").value = int14 - 8191; // display only
                */
                return;
            } else
            {
                // other message
                return;
            }
        }
        //-------------------------------------------------------------------------

    }
}
```
CCMapperを起動したら、次に音源を立ち上げて入力MIDIデバイスを「loopMIDI port」に設定する。

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
switches::
PANIC: [z] send [All Note Off]/[All Sound Off]
PitchBen(d) transfer: [d] toggle
Velocity F(i)xed: [i] toggle
NoteOn/Off Tranfer: [t] toggle

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

## 参考情報           
MIDI tool関連：  
[Protokol - A responsive heavy duty console for troubleshooting control protocols](https://hexler.net/protokol#get)  
MIDIトラフィックをモニターできるツール。(お勧め)  

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

