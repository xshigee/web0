    
# re.corder/Elefueに外部音源(Aria/Windows)を接続する(WIDI_Bud_Pro経由)    

2022/19/20      
初版    
  
## 概要    
re.corder/ElefueにWIDI_Bud_Pro経由で外部音源(Aria/Windows)を接続する。  
re.corder/ElefueはワイヤレスMIDIのコントローラになるので、
PCにワイヤレスMIDIアダプターであるWIDI_Bud_ProのUSBドングルを付けて
接続する。  
なお、旧モデルであるWIDI_Budは、Elefueは接続できたが、re.corderは接続できなかった。WIDI_Bud_Proは両方とも接続できた。  

## 準備
WIDI_Bud_Proを接続する前にドライバーが必要となるので
以下のURLからダウンロートして解凍/インストールする。
\# なぜかKORGのものを使用するようだ。
[ダウンロード　KORG BLE-MIDI Driver/KORG BLE-MIDI Driver](https://www.korg.com/jp/support/download/driver/1/301/2887/)  
<!--
[https://cdn.korg.com/jp/support/download/files/b6964d9fedbff6fb708b9fb8e4514675.zip](https://cdn.korg.com/jp/support/download/files/b6964d9fedbff6fb708b9fb8e4514675.zip)  
-->

上のドライバーがインストール終了したら、PCにWIDI_Bug_Proを刺して電源を入れてbuletooth経由でファームウェアをアップデートする。

iOSのWIDIアプリがアップデートツールになるので、それをインストールして利用する。  
WIDI_Bud_ProのUSBの中には、USB firmware, Bluetooth Firmwareの２つが内蔵されているので必要に応じてiPhoneとWIDI_Bud_Proをbluetooth接続してアップデートすることになる。  

アップデート後、再ペアリングする必要があるので、いったんペアリングを解除する必要がある。

以下、WIDI_Bud_Pro 参照情報：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

## 接続
上の準備が終われば、re.coder/Elefueの電源を入れてbluetoothをオンにすれば
自動的にWIDI_Bud_Proと接続し、接続するとWIDI_Bud_ProのLEDの色がシアンに変る。  

この段階になればPCで音源を立ち上げれば、そのまま利用できる。

## Ariaの場合
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：
  Input MIDI Device: Widi Bud Pro(in)
  Output MIDI Devices: 何も設定しない (Aria自身が音源なので外部音源は不要)
  Adudio Device API: ASIO (ASIO4ALLインストール済みの前提)
  Audio Device: ASIO4ALL (ASIO4ALLインストール済みの前提)
1. Tools/EWI Configuration EWI_USBの設定らしいので、今回の場合、なにもしない。
1. 音色を選択する
このままだとre.corder/Elefueの出力のCC#がAriaに合っていないので、吹いても音がでない。  
・そこで、CC#2(breath control)のノブをマニュアルで大きくすると、音が出るようになる。  
・音色によっては、これだけでは音が出ないので、CC#7(volume)のノブを回して大きくする。
・音程があっていない場合は、Transposeを変更する。　

## re.corderのMIDI設定
Ariaのノブを回して音が出るようにするのは面倒なのでMIDI設定を変更する方法もある。　　
1. breathのCCはデフォルトでは#11(expression)になっているので、それを#2(breath control)に変更する。  
1. MIDI-CHは、1を前提にしているので、音が出ないようなら、ここを変更する。  

なお、ElefueのbreathのCC#11固定になっているので変更できない。

参考：
re.corderのMIDI設定のデフォルト(FAQより)
```
The following are the DEFAULT SETTINGS you need to restore:

Sensitivity
threshold= standard (try ‘low’ if you feel like you’re blowing too much)
speed= 80
MIDI Ch= 1

Pressure
curves= linear (try ’embedded1′ ’embedded2′ or ’embedded3′ if you feel like you’re blowing too much)
aftertouch= off
MIDIOut= 11
# CC#11はexpressionに対応している。

Incliation(Tilt)
curves= embedded12 (set to none if you want to turn off vibrato)
MIDIOut=1
# CC#1はmodulationに対応しているので、re.corderを傾けるとmodulationが変化する

Rotation
curve= embedded13
MIDIOut= 52

Z axis
curve= None (OFF)
MIDIOut= 53
```

## 参考情報
re.corder関連：
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  
[re.corder Downloads](https://www.recorderinstruments.com/en/support-downloads/)  
[re.corder Frequently Asked Questions](https://www.recorderinstruments.com/en/frequently-asked-questions/)    

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  

ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

