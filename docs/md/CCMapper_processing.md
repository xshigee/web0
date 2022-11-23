    
# processingでCCMapperを実装する
 
2022/11/23  
Mac用スケッチを追加した。  

2022/11/3      
初版    
  
## 概要    
「[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)」の続編として、pythonで実装したCCMaperをprocessing(windows版)で実装してみる。

## 準備

1.以下のwindows用processingをダウンロードして解凍する；  

[https://github.com/processing/processing4/releases/download/processing-1286-4.0.1/processing-4.0.1-windows-x64.zip](https://github.com/processing/processing4/releases/download/processing-1286-4.0.1/processing-4.0.1-windows-x64.zip)  


今回、解凍したprocessing-4.0.1(ディレクトリ)を以下に置いた：  
C:\\processing-4.0.1

このなかのprocessing.exeをクリックするとIDEが起動する。

## themidibus(MIDI library)
今回のプログラムはMIDIを使用するのでMIDIlibraryを追加する。  

1.以下のurlからダウンロードして解凍する： 

[http://smallbutdigital.com/releases/themidibus/themidibus-latest.zip](http://smallbutdigital.com/releases/themidibus/themidibus-latest.zip)  


2.解凍後、できたthemidibus(ディレクトリ)をDocuments\\Processing\\librariesのなかにコピーする。
                          

## CCMapper(source code)

以下が今回のソースコードになる。  

CCMapper
```java

// CCMapper (2022/10/31)
import themidibus.*;

MidiBus myBus; // MidiBus instance

void setup() {

    size(150, 150);    // window size
    background(255,0,255);   // window color

    MidiBus.list();                     // disp MIDI device list
    myBus = new MidiBus(this, 2, 6);    // MIDI device input/output assignment
}

void draw(){       
}

void noteOn(int channel, int pitch, int velocity) {
  // Receive a noteOn
  myBus.sendNoteOn(channel, pitch, velocity); 

//println("NoteOn channel:" + channel + " pitch:" + pitch +" velocity:"+ velocity);

}

void noteOff(int channel, int pitch, int velocity) {
  // Receive a noteOff
  myBus.sendNoteOff(channel, pitch, velocity); 

//println("NoteOFF channel:" + channel + " pitch:" + pitch +" velocity:"+ velocity);

}

void controllerChange(int channel, int number, int value){

  if(number == 2 || number == 11){   // breath or expression 
    // for Aria
    myBus.sendControllerChange(channel, 2, value);
    myBus.sendControllerChange(channel, 7, value);
    myBus.sendControllerChange(channel, 26, value);
  }else{
    myBus.sendControllerChange(channel, number, value);
  }

//println("channel:" + channel + " number:" + number +" value:"+ value);

}

```

以下の部分は実行環境依存部分なので自分の環境に合わせて変更する：  
```
    myBus = new MidiBus(this, 2, 6);    // MIDI device input/output assignment
```

## 実行
実行するとコンソール画面が現れて以下のような表示になる。

コンソール出力例
```  
Available MIDI Devices:
----------Input----------
[0] "Real Time Sequencer"
[1] "loopMIDI Port 1"
[2] "WIDI Bud Pro"
----------Output----------
[0] "Gervill"
[1] "Real Time Sequencer"
[2] "Microsoft MIDI Mapper"
[3] "CoolSoft MIDIMapper"
[4] "Microsoft GS Wavetable Synth"
[5] "VirtualMIDISynth #1"
[6] "loopMIDI Port 1"
[7] "WIDI Bud Pro"
Copied to the clipboard. Use shift-click to search the web instead.

```
上のように接続している入力MIDIデバイス、出力MIDIデバイスが表示される。

MIDI接続状況：  
MIDIとしての接続は「[re.corder/ElefueをCCMapper経由で外部音源(Aria/Windows)と接続する(WIDI_Bud_Pro使用)](https://xshigee.github.io/web0/md/CCMapper_Aria.html)」と同じ接続にする。


## 追加：Mac用スケッチ

CCMapperMac
```java

// CCMapper for Mac (2022/11/23)

import themidibus.*;

MidiBus myBus; // MidiBus instance

void setup() {

    size(150, 150);    // window size
    background(255,0,255);   // window color

    MidiBus.list();                     // disp MIDI device list
    myBus = new MidiBus(this, 2, 2);    // MIDI device input/output assignment
}

void draw(){       
}

void noteOn(int channel, int pitch, int velocity) {
  // Receive a noteOn
  // will NOT send it at Mac Env.
  //myBus.sendNoteOn(channel, pitch, velocity);

//println("NoteOn channel:" + channel + " pitch:" + pitch +" velocity:"+ velocity);

}

void noteOff(int channel, int pitch, int velocity) {
  // Receive a noteOff
  // will NOT send it at Mac Env.
  //myBus.sendNoteOff(channel, pitch, velocity);

//println("NoteOFF channel:" + channel + " pitch:" + pitch +" velocity:"+ velocity);

}

void controllerChange(int channel, int number, int value){

  if(number == 2 || number == 11){   // breath or expression
    // for Aria
    myBus.sendControllerChange(channel, 2, value);
    myBus.sendControllerChange(channel, 7, value);
    myBus.sendControllerChange(channel, 26, value);
  }else{
    myBus.sendControllerChange(channel, number, value);
  }

//println("channel:" + channel + " number:" + number +" value:"+ value);

}
```

## 関連情報   
MidiBus(MIDI foor processing)関連：    
[The MidiBus Online Javadocs](http://www.smallbutdigital.com/docs/themidibus/themidibus/package-summary.html)  
[themidibus/Class MidiBus](http://www.smallbutdigital.com/docs/themidibus/themidibus/MidiBus.html)  

processing関連：  
[MIDIコントローラーでProcessingをコントロールする](https://qiita.com/jacynthe/items/aa985c23fd0a82fe84b1)  
[ProcessingでMIDIコントローラーを使用する(MIDIBUS)](https://half-half.info/?p=467)  
[MIDI Harmonizer](https://www.johanlooijenga.com/)  

openframeworks関連：   
[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/create-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
[Novation LauchpadとopenFrameworksを使ってResolumeのVJコントローラを作る : コーディング編](https://artteknika.hatenablog.com/entry/2016/09/30/223230)  
[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)   
[新規プロジェクトの作成](https://openframeworks.cc/ja/learning/01_basics/create_a_new_project/)  
                                   
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

