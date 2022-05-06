    
# EWI5000にSWAM音源(@iPad)を接続する    

2022/5/6      
初版    
  
## 概要    
EWI5000には、USBやMIDI-OUT端子があるので、これを使って外部音源を接続することができる。  
ここでは、iPadのSWAM音源を接続してみる。

### 0. EWI5000のMIDI-OUT設定
1. EWI5000とPCをUSB接続する。
1. PCのEWI5000_Editorを起動する。
1. 画面で「Controller/Breath」を選択して
以下にように設定する：  
Breath(br): Low Resolution(Lr)  
Volume(vo): Low Resolution(Lr)  
Expression(EP): Low Resolution(Lr)  
1. EWI5000_Editorを終了する。  
1. 必要なければPCとEWI5000とのUSBケーブルを外す。  

以降、この設定で外部音源と接続する。

### 1. SWAM音源のインストール
iPadに以下のリンクを参考に音源をインストールする：  
[SWAM Violin [iPad]](https://applion.jp/ipad/app/1458132239/)  
[Audio ModelingのiPadアプリ一覧](https://applion.jp/ipad/developer/1326331126/)  

以下に、EWI5000向けの設定例が載っている：  
[EWI5000とSWAM Saxophonesで「傷だらけの天使のテーマ」](https://ameblo.jp/yoshmeme/entry-12603686223.html)  

### 2. bluetooth-MIDI接続
以下の手順でbluetooth-MIDIでiPadとEWI5000(+ WIDI_Master)を接続できる。

1. WIDI_Masterのファームウェア・アップデート
以下の手順はiPhone/iPadが必要となる：  

    1. 以下のWIDI_Masterを購入する。  
[https://hookup.co.jp/products/cme/widi-master](https://hookup.co.jp/products/cme/widi-master)  
    1. WIDI_MasterをEWI5000のMIDI-OUTに接続する。  
MIDI-OUTから電源を供給する方式なので特に電源アダプタを用意する必要はない。
   1. EWI5000をオンにしてWIDI_Masterに電源を供給する。  
   1. iPhone/IpadアプリのWIDI_Appをインストールして、(購入直後はファームウェアが古いので)bluetooth経由でファームウェアをアップデートする。  
アップデート開始時は、Updaterというデバイスが出現するので自動的にそのデバイスと接続してデバイスをアップデートする。  
アップデート後はリブートする必要がある。(電源を入れ直す)  

2. iPadの設定
    1. 設定でbluetoothをオンにする。
    1. SWAM音源を起動する。
    1. EWI5000(WIDI_Master)をオンにする。

3. SWAM音源の設定
    1. SWAM音源画面の最上行の最右端の「...」アイコンを押す。
    1. Setting/MIDI/Bluetooth_MIDIを選択する。
    1. bluetooth_MIDI_デバイス名が表示されるので
接続したいデバイス名を選択する。  
今回の場合、WIDI_Masterを選択する。  
    1. 「Connected」が表示される。
    1. トップメニューに戻る。
    1. MIDIアイコンを押す。
    1. INPUTS,PRESET,MAPPING_TABLEが表示される。
    1. INPUTSを押して、現在、接続されているデバイスを確認する。
希望していないデバイスも選択されていたら無効にする。
    1. PRESETSを押して「EWI Default」を選択する。
ついでの話だがAerophoneを接続する場合は  
「Roland Aerophone Default」を選択する。
    1. 以上でEWI5000を吹くとiPadから音が出る。
    本格的に使うには、MAPPING_TABLEなどを変更して、さらに調整するほう良い。
    1. 終了する場合、INPUTSで表示されるデバイスを無効にする。
そうしないと他の音源に切り替えた時も、この音源の音が出ることになる。
または、以下にある方法でSWAM音源アプリ自身を終了させる。  
[iPad で App を終了する方法](https://support.apple.com/ja-jp/HT212063)  
[iPhone や iPod touch で App を終了する方法](https://support.apple.com/ja-jp/HT201330)  

## 参考情報

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

