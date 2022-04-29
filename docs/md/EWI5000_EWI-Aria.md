    
# EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する    

2022/4/29  
EWI5000のMIDI-OUT設定について追加した。  

2022/4/24++      
初版    
  
## 概要    
EWI5000には、USBやMIDI-OUT端子があるので、これを使って外部音源を接続することができる。  
以下に音源の接続方法について説明する。  

## 0. EWI5000のMIDI-OUT設定
1. EWI5000とPCをUSB接続する。
1. PCのEWI5000_Editorを起動する。
1. 画面で「Controller/Breath」を選択して
以下にように設定する：  
Breath(br): Low Resolution(Lr)  
Volume(vo): Low Resolution(Lr)  
Expression(EP): Low Resolution(Lr)  
1. EWI5000_Editorを終了する。  
1. 必要なければPCとEWI5000とのUSBケーブルを外す。  
(Aria音源を有線接続で使用するときは、そのままとする)

以降、この設定で外部音源と接続する。

## EWI3000mの場合
### 1.有線接続(MIDIケーブル)
EWI3000の音源であるEWI3000mのMIDI-INとEWI5000のMIDI-OUTをMIDIケーブルで接続する。

接続後、以下の手順でEWI3000mを立ち上げる：
1. EWI3000mのバックアップ電池は電池寿命が尽きていてバックアップできていないので、起動時は、工場出荷時の設定に初期化する必要がある。  
それには、「MIDI」と「UP」ボタンを同時押しで電源ONする。  
\# 音源としてではなく、MIDIコンバータとして使用するには、
バックアップ電池が尽きていても使用できる。    
\# いうまでもないが、音源として使用する場合はバックアップ電池を交換する必要がある。(交換は基板上の電池を交換することになる)    

### 2. bluetooth-MIDI接続
1. ２つのWIDI_Masterを用意する。
1. EWI3000mのMIDI-OUT/MIDI-INの両方にWIDI_Masterを接続する。(実際に必要なものはMIDI-INのみだが電源を供給するためにMIDI-OUTも接続する)
1. EWI5000のMIDI-OUTにWIDI_Masterを接続する。

以下の手順でEWI5000とEWI3000mを立ち上げる：
1. WIDI_Mastを接続したEWI5000の電源を入れる。
1. EWI3000mのバックアップ電池は電池寿命が尽きていてバックアップできていないので、起動時は、工場出荷時の設定に初期化する必要がある。  
それには、「MIDI」と「UP」ボタンを同時押しで電源ONする。  
\# 音源としてではなく、MIDIコンバータとして使用するには、
バックアップ電池が尽きていても使用できる。    
\# いうまでもないが、音源として使用する場合はバックアップ電池を交換する必要がある。(交換は基板上の電池を交換することになる) 
1. 以上でEWI5000側のWIDI_MasterとEWI3000m側のWIDI_Masterが自動的にペアリングして接続する。   


## Aria(ソフトウェア音源)の場合
ソフトウェア音源なので以下からダウンロードしてWindowsにAriaをインストールする。  
[EWI USB Aria Software for Windows](http://b8e57dc469f9d8f4cea5-1e3c2cee90259c12021d38ebd8ad6f0f.r79.cf2.rackcdn.com/Product_Downloads/EWIUSB%20Software%20for%20Windows.zip_93a42df18f89c939961652a4fa1a7c82.zip)  
[EWI USB Aria Software Update v1.005 for Windows](http://6be54c364949b623a3c0-4409a68c214f3a9eeca8d0265e9266c0.r0.cf2.rackcdn.com/493/downloads/akai_ewi_usb_v1005_win_exe_01.zip)    
詳細は以下のサイトを参照のこと  
[EWI USB](http://ewi.akai-pro.jp/ewiusb/)  

### 1.有線接続(USBケーブル)
1. PCとEWI5000をUSBで接続する。
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：
    * Input MIDI Device: EWI5000(in)
    * Output MIDI Devices: 何も設定しない
    (Aria自身が音源なので外部音源は不要)
    * Adudio Device API: ASIO
    (ASIO4ALLインストール済みの前提)
    * Audio Device: ASIO4ALL
     (ASIO4ALLインストール済みの前提)
1. Tools/EWI Configuration
EWI_USBの設定らしいので、今回の場合、なにもしない。
1. 音色を選択する  
[EWI-USB 導入ガイド](https://www.inmusicbrands.jp/support/data/EWI-USB_Setup_Guide.pdf)の「3. ARIA で音色を選択する」を参照のこと。

注意：  
AriaとEWI5000_Editorを同時に立ち上げると「Connection Error」 になるので、AriaかEWI5000_Editorの排他使用にすること。また、どのくらい効果あるかは不明だがUSB接続の場合はEWI5000のMIDI出力をHighResolutionにしても大丈夫のようだ。

### 2. bluetooth-MIDI接続
以下の手順でbluetooth-MIDIでPCとEWI5000(+ WIDI_Master)を接続できる。

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
また、アップデートでbluetooth接続ができない場合はiPhoneのbluetooh設定でいったんWIDI_Masterのデバイスを削除すると良い。
    1. WIDI_Appでデバイス名は変更できるので複数のWIDI_Masterを使用している場合はデバイス名を変更したほうが良い。リブート後、変更は有効になる。  
    1. 以上でWIDI_Masterが有効になる。

2. PCの設定
    1. bluetooth_dongleの購入  
PC内蔵のbluetoothでは動作が非常に不安定だったので、なるべく最近の規格をサポートしているdongleを購入して使用する。  
今回は以下を使用した：  
[tp-link UB500 - Bluetooth 5.0 ナノUSBアダプター](https://www.tp-link.com/jp/home-networking/computer-accessory/ub500/)  
    1. PCに上のdongleを刺す。
    1. loopMIDIをインストールする
以下のurlからダウンロード&解凍してインストールする。  
[https://www.tobias-erichsen.de/wp-content/uploads/2020/01/loopMIDISetup_1_0_16_27.zip](https://www.tobias-erichsen.de/wp-content/uploads/2020/01/loopMIDISetup_1_0_16_27.zip)   
参照：[loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)
    1. MIDIberryをインストールする
以下のMicrosoft-Storeからインストールする。  
[https://www.microsoft.com/ja-jp/p/midiberry/9n39720h2m05?activetab=pivot:overviewtab](https://www.microsoft.com/ja-jp/p/midiberry/9n39720h2m05?activetab=pivot:overviewtab)
    1. PCを再起動する

3. 再起動後
    1. PCのbluetooth設定でbluetoothをオンにする。
    1. [Bluetoothまたはその他のデバイスを追加する]を選択する。
    1. [Bluuetooth]を選択してデバイスを検索する。
    1. WIDI_Masterが見つかったら接続する。
    1. (自動的に起動している)LoopMIDIで仮想MIDIポートを作成する。(以下、参照のこと)
[Windowsで仮想MIDIドライバーを使用する方法解説 ](https://canplay-music.com/2019/12/14/loopmidi/)  
    1. MIDIberryを起動して入力と出力ポートを設定する。
        * 入力：WIDI_Master
        * 出力：loopMIDI port
たぶん自動検出で設定されると思うが、そうでない場合は上のように設定する。
注意：loopMIDIを使う場合はMIDIberryを起動する前に、loopMIDIを起動する必要あり。通常はloopMIDIのほうがPC起動時に先に立ち上がるので特に問題はない。
    1. ソフト音源Ariaを立ち上げる。
    1. Tools/Preferenceを選択して以下を設定する：
        * Input MIDI Device: loopMIDI port    
    これでWIDI_Masterで受信したMIDIデータがloopMIDI_portに流れ、そのportのMIDIデータをソフト音源Ariaが受信することになる。
    1. 以上でAriaとEWI5000がbluetooth-MIDIで接続された状態になる。


##  WIDI_uhost
EWI5000本体にWIDI_Masterを接続する代わりに、以下のWIDI_uhostをUSB経由でEWI5000に接続しても同様のことができるはずだが、実際にやってみる動作しなかった。

[https://hookup.co.jp/products/cme/widi-uhost](https://hookup.co.jp/products/cme/widi-uhost)

ここでは記録としてやったことを残す。

1. 本体との接続接続
    1. WIDI_uhostの電源供給用としてUSBのACアダプターとWIDI_uhostを接続する。(USB-Power側)  
電源スイッチがないので直ぐにuhostの電源がオンになる。
    1. EWI5000本体とWIDI_uhostを「USB-A 2.0 to USB-C ケーブル」で接続する(USB-Host/Device側)  
これは別売の「WIDI-USB-B OTG Cable Pack I」に含まれる。
1. ファームウェア・アップデート
    1. WIDI_Masterと同様にiPhone/iPadでファームウェアをアップデートする。  
WIDI_Masterと異なり２つのファームウェア(USB firmware, Bluetooth firmware)をアップデートすることになる。
    1. WIDI_uhostをリブートする(uhostの電源をいったん切る)
1. bluetooth接続
WIDI_Masterと同様にPCと接続する。

以上でbluetooth接続が確立するが、EWIを吹いてもMIDIデータが流れない。

EWI5000のUSB-MIDIのファームウェアとuhostのファームウェアの相性の問題でMIDIデータが流れないようだ。


## 参考情報

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  


ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

