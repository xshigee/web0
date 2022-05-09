    
# Aerophone(AE-20)に外部音源(EWI3000m,Aria/Windows)を接続する    

2022/5/9  
AE-20のMIDI-OUT設定を改版した。  

2022/5/5+  
EWI3000mのバッテリ交換を追加した。  

2022/4/29      
初版    
  
## 概要    
Aerophone(AE-20)には、MIDIコネクタがないが、USBとbluetoothがあるので、それを使って外部音源を接続することができる。  
以下に音源の接続方法について説明する。  

## EWI3000mの場合

### 1. bluetooth-MIDI接続
1. 1つのWIDI_Masterを用意する。  
[WIDI_Master](https://hookup.co.jp/products/cme/widi-master) 
1. EWI3000mのMIDI-OUT/MIDI-INの両方にWIDI_Masterを接続する。  
(実際に必要なものはMIDI-INのみだが電源を供給するためにMIDI-OUTも接続する)

以下の手順でAE-20とEWI3000mを立ち上げる：
1. 周りにあるスマフォやPCのbuletoothをオフする。  
特に「Aerophone Pro Editor」をインストールしてあるiPhone/iPadは、bluetoothをオフにする。  
理由として、bluetoothの意図しない接続を回避するためにそうする。
1. AE-20の電源を入れる。
1. EWI3000mの電源を入れる。  
EWI3000mのバックアップ電池は電池寿命が尽きていてバックアップできていないので、起動時は、工場出荷時の設定に初期化する必要がある。  
それには、「MIDI」と「UP」ボタンを同時押しで電源ONする。  
\# 音源としてではなく、MIDIコンバータとして使用するには、
バックアップ電池が尽きていても使用できる。    
\# いうまでもないが、音源として使用する場合はバックアップ電池を交換する必要がある。(交換は基板上の電池を交換することになる) 
1. 以上でAE-20側とEWI3000m側のWIDI_Masterが自動的にペアリングしてbluetoothで接続する。  
(WIDI_MasterのLEDは、シアン色に点灯する。MIDIデータが流れると点滅する)
1. EWI3000m(音源)のMIDI受信設定はOMNIにする。
LCD表示：「M:RX CHANNL OMNI」
1. EWI3000m(音源)のブレス設定はBREATHにする。
LCD表示：「M:BREATH=BREATH」
1. AE-20を吹くとEWI3000mが鳴る。  
(PHONEにヘッドフォンを接続する)

WIDI_Masterのファームウェア・アップデートする場合： 
購入直後のファームウェアでも動作すると思うが最新ファームウェアにアップデートする場合は以下の手順で行なう.

以下の手順はiPhone/iPadが必要となる：  
   1. WIDI_MasterをEWI3000mのMIDI-OUTに接続する。  
MIDI-OUTから電源を供給する方式なので特に電源アダプタを用意する必要はない。
   1. EWI3000mをオンにしてWIDI_Masterに電源を供給する。  
   1. iPhone/IpadアプリのWIDI_Appをインストールして、(購入直後はファームウェアが古いので)bluetooth経由でファームウェアをアップデートする。  
アップデート開始時は、Updaterというデバイスが出現するので自動的にそのデバイスと接続してデバイスをアップデートする。  
アップデート後はリブートする必要がある。(電源を入れ直す)  
また、アップデートでbluetooth接続ができない場合はiPhoneのbluetooh設定でいったんWIDI_Masterのデバイスを削除すると良い。  
    1. WIDI_Appでデバイス名は変更できるので複数のWIDI_Masterを使用している場合はデバイス名を変更したほうが良い。リブート後、変更は有効になる。  
    1. 以上でWIDI_Masterが有効になる。

ちょっとした実験：  
以上の設定で、MIDIの流れる方向として、EWI3000からAE-20にもMIDIデータを流すことができるので、EWI3000を吹くと、AE-20の内蔵音源を鳴らすことができると思って実験してみたがAE-02のほうで音は鳴らなかった。  
EWI3000を吹くとWIDI_MasterのLEDが点滅しているのでMIDIデータは流れていると思われる。  
→  
再度、設定などを変更してEWI3000を吹いたら期待通り音が鳴った。    
関係あるか不明だが、AE-20のUSB_DriverをGenericにした。  
吹いていると時々音が切れたが、その場合、音色を切り替えたら復活した。  
送れるMIDIデータがブレスとピッチベンドだけのせいか表現はAE-20を吹くよりも貧弱なものになった。  

[Aerophone AE-20: 外部MIDI機器やDAWからAE-20の音源を鳴らす方法を教えてください。](https://rolandus.zendesk.com/hc/ja/articles/5009556342939-Aerophone-AE-20-%E5%A4%96%E9%83%A8MIDI%E6%A9%9F%E5%99%A8%E3%82%84DAW%E3%81%8B%E3%82%89AE-20%E3%81%AE%E9%9F%B3%E6%BA%90%E3%82%92%E9%B3%B4%E3%82%89%E3%81%99%E6%96%B9%E6%B3%95%E3%82%92%E6%95%99%E3%81%88%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84-)


## Aria(ソフトウェア音源)の場合
ソフトウェア音源なので以下からダウンロードしてWindowsにAriaをインストールする。  
[EWI USB Aria Software for Windows](http://b8e57dc469f9d8f4cea5-1e3c2cee90259c12021d38ebd8ad6f0f.r79.cf2.rackcdn.com/Product_Downloads/EWIUSB%20Software%20for%20Windows.zip_93a42df18f89c939961652a4fa1a7c82.zip)  
[EWI USB Aria Software Update v1.005 for Windows](http://6be54c364949b623a3c0-4409a68c214f3a9eeca8d0265e9266c0.r0.cf2.rackcdn.com/493/downloads/akai_ewi_usb_v1005_win_exe_01.zip)    
詳細は以下のサイトを参照のこと  
[EWI USB](http://ewi.akai-pro.jp/ewiusb/)  

### 0. AE-20のMIDI-OUT設定
1. bluetooth接続の「Aerophone Pro Editor」(iPhone/iPad)を起動して、EDITOR/MIDI_OUTに入り、Breathに(1と2は定義済なので)3として\[CC07:VOLUME]、4として\[CC26]を追加する。　　
これでBreathで以下がMIDIで送信されることになる。
    1. \[CC11:EXPRESSION]
    1. \[CC02:BREATH]
    1. \[CC07:VOLUME]
    1. \[CC26]
\# \[CC26] は、Ariaの音色名の中で「TH」が付いているものが、CC26で制御されているので定義として追加する。
1. 設定を保存するために\[WRITE]を押す。  
「Scene Write」の画面になるので以下を入力して\[OK]を押す。  
Scene Group: User 01　(任意)  
Scene: u01-01.ExternalAria　(任意)  
Scene Name: ExternalAria　(任意)  
1. 以上で、設定が保存できた。  

この設定をシーンとして呼び出すときは、AE-20本体で  
1. \[SCENE](▼)を押しながら[SCENE CATEGORY]つまみを回しユーザー・バンクを選ぶ。
1. \[SCENE](▲/▼)で、ユーザー・シーンを選ぶ。
今回の場合、「ExternalAria」を選ぶ。

### 1.有線接続(USBケーブル)
1. PCを起動する。
1. AE-20を起動する。
1. AE-20とPCをUSBで接続する。
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：
    * Input MIDI Device: AE-20(in)
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
1. AE-20本体で既に設定保存してあるユーザー・シーン「ExternalAria」を選択する。
1. 以上で、AE-20を吹くとPCから音が鳴る。

また、AE-20は、USBスピーカの機能があり、PCのスピーカから切り替わっていて音がでない場合もあるので、PCから音が出ない場合、PCのサウンド設定を確認すること。

### 2. bluetooth-MIDI接続
1. PCの設定
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
使って
3. 再起動後
    1. AE-20とiPhone/iPadのbluetooth接続は切る。
    (iPhone/iPadのbluetoothはオフする)
    1. AE-20本体で既に設定保存してあるユーザー・シーン「ExternalAria」を選択する。
    1. PCのbluetooth設定でbluetoothをオンにする。
    1. [Bluetoothまたはその他のデバイスを追加する]を選択する。
    1. [Bluuetooth]を選択してデバイスを検索する。
    1. WIDI_Masterが見つかったら接続する。  
    1. (自動的に起動している)LoopMIDIで仮想MIDIポートを作成する。(以下、参照のこと)  
[Windowsで仮想MIDIドライバーを使用する方法解説 ](https://canplay-music.com/2019/12/14/loopmidi/)  
    1. MIDIberryを起動して入力と出力ポートを設定する。
        * 入力：AE-20(bluetooth MIDI IN)
        * 出力：loopMIDI port
たぶん自動検出で設定されると思うが、そうでない場合は上のように設定する。
注意：loopMIDIを使う場合はMIDIberryを起動する前に、loopMIDIを起動する必要あり。通常はloopMIDIのほうがPC起動時に先に立ち上がるので特に問題はない。
    1. ソフト音源Ariaを立ち上げる。
    1. Tools/Preferenceを選択して以下を設定する：
        * Input MIDI Device: loopMIDI port    
    これでWIDI_Masterで受信したMIDIデータがloopMIDI_portに流れ、そのportのMIDIデータをソフト音源Ariaが受信することになる。
    1. 以上でAriaとAE-20がbluetooth-MIDIで接続された状態になる。

この時点で接続できていると思うが、AE-20を吹いても、MIDIデータが流れない場合、PCを再起動してやり直す。    
(MIDIberryでMIDIデータをモニターできる)  

誤ってAE-20のシーンを変えた場合も、元に戻しても接続できないようなので、PCを再起動してやり直す。 

## iPhone/iPad音源の場合
ここでは、AE-20とiPhone/iPadをbluetoothで接続することにする。  
音源として色々あるが、ここではウィンドウ・コントローラと相性がよさそうな「Magellan 2」を使ってみる。

以下が接続手順になる：

1. 「Magellan 2」をiPhone/iPadにインストールする。
1. AE-20の電源を入れる。  
(AE-20本体で既に設定保存してあるユーザー・シーン「ExternalAria」を選択する)  
1. iPhone/iPadのbluetoothを有効にする。
1. AE-20とiPhone/Ipadをbluetooth-MIDI接続する。  
具体的には、「Korge Gadget2」の設定「Bluetooth MIDI/Settings」でBluetooth_MIDI_DeviceリストからAE-20を選択する。
1. 任意であるが、音色として「The ONE/ The Lead」を選択する。
1. アプリ画面の上のほうにある\[PREFS](Preference)を押す。
1. 設定画面に入るので以下に設定する：  
    MIDI Note in Channel: OM  
    \# OMはOMNIの意味  
1. この時点で、AE-20を吹くとiPhone/iPadから音が出る。
1. 他の音源に切り替えるときは、そのままだと複数の音源から音が出ることなるので、不要であれば、無効にしたい音源のMIDI入力をオフにするか、muteがあれば、それを有効にする。

## EWI3000mのバッテリ交換
音源として使用するときバッテリ交換を行なう。   
手順は以下のとおり：  

1. 以下を準備する：
    * [ボタン電池基板取付用ホルダー　ＣＲ２０３２用（小型タイプ）](https://akizukidenshi.com/catalog/g/gP-00706/)
    * ボタン電池　CR2032 1個  
[リチウム電池　ＣＲ２０３２　ゴールデンパワー製　（５個入）](https://akizukidenshi.com/catalog/g/gB-05694/)  
1. 以下のリンクを参考にして基板上の半田付けされている電池を外し電池ホルダに交換してCR2032を取り付ける。
    * [EWI3000m 電池交換 ＜その２＞](https://blog.goo.ne.jp/tmisoami/d/20090222)  
    * [基板写真(EWIバッテリー改造)](https://plaza.rakuten.co.jp/islan00/diary/202004020001/?scid=we_blg_pc_lastctgy_1_title)  
上のリンクでは端子取付穴ピッチのズレを指摘しているが特に問題なくホルダを付けることができた。   
(「電池ホルダにはセメダイン塗布」はしていない)  
また、EWI3000と接続しているINSTRUMENTコネクタは、EWI3000を、いったん外すと再度、接続するのが大変なので、そのままにしておくことを勧める。  

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

