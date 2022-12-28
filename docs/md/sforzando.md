    
# sforzandoを使う  

2022/12/28      
初版    
  
## 概要    
一般に広まっているサンプラーのデータフォーマットであるsoundfont(.fs2形式)のデータを扱えるプレーヤーとしてsforzandを使ってみる。  
CCMapperと組み合わせればwind_controlerの音源としても利用できる。

## インストール
プログラム：   
[https://www.plogue.com/downloads.html#sforzando](https://www.plogue.com/downloads.html#sforzando)  
上のurlからWindowsとMacのうち必要なものをダウンロードしてインストールする。  
データも同じところに置いてあるので、それもダウンロードする。

soundfontデータ：  
.sf2のフリーのデータは以下に置いてあるのでダウンロードする：
[Files for free-soundfonts-sf2-2019-04](https://archive.org/download/free-soundfonts-sf2-2019-04)  


## 使い方
[sforzando_guide](https://s3.amazonaws.com/sforzando/sforzando_guide.pdf)    
使い方は上のリンクに詳細がのっているが
簡単に説明すると、起動して、入力を「loopMIDI」にして、CCMapperを立ち上げて
wind_controlerを接続すれば音が出る。    
キーボード系の音色はとりあえず、音が出るレベルなので
よりwind_controler向けのもの(brass,synth,organなど)にする。  

.sf2の読み込みは、[SNAPSHOT/load]で.sf2を開くと自動的に変換される。 
(最初の１回のみ、変換結果を入れるディレクトリを指定する)  

## 参考情報 
soundfont関連：  
[【無料】多くの音色が無料で公開されているPlogueのSFZサンプラーsforzandoの紹介](https://chilloutwithbeats.com/plogue-sforzando-intro/)  
[SoundFont® Technical Specification ](https://freepats.zenvoid.org/sf2/sfspec24.pdf)  
[SoundFontの取り扱い02 – SoundFontのフォーマット](https://www.utsbox.com/?p=2090)  
[SoundFont](https://en.wikipedia.org/wiki/SoundFont)  
[SFZ (file format)](https://en.wikipedia.org/wiki/SFZ_(file_format))  
[The SFZ Format](http://ariaengine.com/overview/sfz-format/)  

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

