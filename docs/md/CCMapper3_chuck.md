    
# CCMapper3(chuck)

2024/1/13+      
初版    
  
## 概要   
本記事は「[CCMapperをchuckで実装する](https://xshigee.github.io/web0/md/CCMapper_chuck.html)」の続編になる。chuckのプログラムを他の実装のCCMapperと同じ機能を持つものに改良した。キー入力で設定を変更する仕様にしたかったが、MIDI送受信しながらキー入力する実装ができなかったので、キー入力がないままになる。   

参照：   
[ChucK : Strongly-timed, Concurrent, and On-the-fly Music Programming Language](https://chuck.stanford.edu/)  

## インストール
[ChucK : Release version:1.4.1.1 (numchucks)](https://chuck.cs.princeton.edu/release/)  
上のリンクからOS(MacOS,Linux,Windows)に応じたインストールプログラムをダウンロードしてインストールする。  
miniAudicleといわれるIDEも同時にインストールされるが、本記事では、プログラミング言語chuckのみを使用する。    
windowsではエラーになり動作しない。Linux/Macは動作する。  

## CCMapper3.ck

CCMapper3.ck
```c++

// CCMapper3
// 2024/1/13

// channel voice messages
0x80 => int MIDI_NOTE_OFF;
0x90 => int MIDI_NOTE_ON;
0xB0 => int MIDI_CONTROL_CHANGE;
0xC0 => int MIDI_PROGRAM_CHANGE;
0xE0 => int MIDI_PITCH_BEND;
0xD0 => int MIDI_AFTER_TOUCH; // Channel Pressure
0xA0 => int MIDI_POLY_PRESSURE;

// disp device status
//chuck --probe

// the message
MidiMsg msg;

//create object
MidiIn min;
MidiOut mout;

//connect to port Elefue/re.corder
min.open(1);
//connect to port loopMIDI
mout.open(0);

0 => int curNote;

while(true){
  // Use the MIDI Event from MidiIn
  min => now;
  while( min.recv(msg) ){
    //<<<msg.data1,msg.data2,msg.data3,"MIDI Message">>>;

    if (msg.data1 == MIDI_NOTE_OFF) {
      mout.send(msg);
      // All Note Off
      MIDI_CONTROL_CHANGE => msg.data1;
      123 => msg.data2;
      0 => msg.data3;
      //return;
    } else if (msg.data1 == MIDI_NOTE_ON) {
      mout.send(msg);
      msg.data2 => curNote;
    } else if (msg.data1 == MIDI_CONTROL_CHANGE) {
      msg.data1 => int status;
      msg.data2 => int control;
      msg.data3 => int value;
      (status & 0xF) + 1 => int channel;
      if ((control == 2)||(control == 11)){
            //1 => msg.data2;
            //mout.send(msg);
            2 => msg.data2;
            mout.send(msg);
            7 => msg.data2;
            mout.send(msg);
            11 => msg.data2;
            mout.send(msg);
            74 => msg.data2;
            mout.send(msg);
            26 => msg.data2;
            mout.send(msg);
            // AT
            MIDI_AFTER_TOUCH + channel - 1 => msg.data1;
            value & 0x7F => msg.data2;
            mout.send(msg);
            // PP
            MIDI_POLY_PRESSURE + channel - 1 => msg.data1;
            curNote & 0x7F => msg.data2;
            value & 0x7F => msg.data3;
            mout.send(msg);
      } else if(control == 1) {
            // Modulation Wheel
            mout.send(msg);
      }
    } else if (msg.data1 == MIDI_PITCH_BEND){
            mout.send(msg);
            int int14;
            msg.data3 => int14;  // 2nd byte
            (int14<<7) => int14;
            (int14|(msg.data2 & 0x7F)) => int14;
            <<< "PITCH_BEND: ", int14 >>>;
    }
  }
}
```

以下のデバイス番号は実行環境に依存するので、自分の環境に合わせること。  
```c++
//connect to port Elefue/re.corder
min.open(1);
//connect to port loopMIDI
mout.open(0);
```

自分の環境を確認する場合は  
以下のコマンドを実行するとデバイス状況を表示する：  
```
chuck --probe
```
出力例(MIDI/HIDデバイスのみ)：
```
[chuck]: ------( chuck -- 2 MIDI inputs )------
[chuck]:     [0] : "loopMIDI bus1"
[chuck]:     [1] : "Elefue Bluetooth"
[chuck]: 
[chuck]: ------( chuck -- 2 MIDI outputs )-----
[chuck]:     [0] : "loopMIDI bus1"
[chuck]:     [1] : "Elefue Bluetooth"
[chuck]: 
[chuck]: ------( chuck -- 1 mouse device )------
[chuck]:     [0] : "Apple Internal Keyboard / Trackpad"
[chuck]: 
[chuck]: ------( chuck -- 1 keyboard device )------
[chuck]:     [0] : "Apple Internal Keyboard / Trackpad"
[chuck]: 
osx_version = 4865 
[chuck]: ------( chuck -- 1 multitouch device )------
[chuck]:     [0] : "MultiTouch Device"
[chuck]: 
```

## 関連情報  
CCMapper関連：  
[CCMapper改良版(openFrameworks)](https://xshigee.github.io/web0/md/CCMapper2_improved_ofx.html)  
[CCMapper(C#版/RtMidi)](https://xshigee.github.io/web0/md/CCMapper_CS_RtMidi.html)  
[processingでCCMapperを実装する](https://xshigee.github.io/web0/md/CCMapper_processing.html)  
[python版CCMapper - re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)  

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
