    
# EWI3000をEWI-USB(もどき)として使う(Aria/Windows編)    

2022/4/23+      
初版    
  
## 概要    
大昔のEWI3000(音源モジュール：EWI3000m)をEWI-USBとして使う方法について記する。  
音源モジュールのEWI3000mはMIDI-IN/OUTの端子があるので、なにかしらの方法で外部音源を接続できれば、それを利用して音を出すことができる。  
ここでは、WindowsのEWI用音源ソフトであるAriaを利用する。  


## 必要な機材
* [Roland UM-ONE-MK2 (USB MIDI Interface)](https://www.roland.com/jp/products/um-one_mk2/)  
MIDI IN/OUTをUSBに変換するアダプター(これが定番らしい)  
* [スイッチングＡＣアダプター１５Ｖ１．２Ａ　１００Ｖ～２４０Ｖ　ＧＦ１８－ＵＳ１５１２－Ｔ(GF18-US1512-T)](https://akizukidenshi.com/catalog/g/gM-02195/)  
EWI3000m用代替ACアダプター  
純正のACアダプターを紛失したので、その代わりのACアダプター。もちろん、純正があるなら不要。

## 必要なソフトウェア  

* ソフトウェア音源  
ソフト音源として以下からダウンロードしてWindowsにAriaをインストールする。  
[EWI USB Aria Software for Windows](http://b8e57dc469f9d8f4cea5-1e3c2cee90259c12021d38ebd8ad6f0f.r79.cf2.rackcdn.com/Product_Downloads/EWIUSB%20Software%20for%20Windows.zip_93a42df18f89c939961652a4fa1a7c82.zip)  
[EWI USB Aria Software Update v1.005 for Windows](http://6be54c364949b623a3c0-4409a68c214f3a9eeca8d0265e9266c0.r0.cf2.rackcdn.com/493/downloads/akai_ewi_usb_v1005_win_exe_01.zip)    
詳細は以下のサイトを参照のこと  
[EWI USB](http://ewi.akai-pro.jp/ewiusb/)  

## 有線接続
1. PCをUSBでUM-ONE-MK2を接続する 
1. UM-ONE-MK2のスライドスイッチをcomputer側にする。 
1. UM-ONE-MK2のMIDI-OUT[CONNECT TO MIDI IN]をEWI3000mのMIDI-INに接続する。  
   今回の場合、PCからEWI3000mにMIDI信号が流れることがないので接続しなくてもかまわない。
1. UM-ONE-MK2のMIDI-IN[CONNECT TO MIDI OUT]をEWI3000mのMIDI-OUTに接続する。 
1. EWI3000mとACアダプターを接続する。

## 起動

PC側：
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：
    * Input MIDI Device: 3-UM-ONE  
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

EWI3000m側：
1. EWI3000mのバックアップ電池は電池寿命が尽きていてバックアップできていないので、起動時は、工場出荷時の設定に初期化する必要がある。  
それには、「MIDI」と「UP」ボタンを同時押しで電源ONする。  
\# 音源としてではなく、MIDIコンバータとして使用するには、
バックアップ電池が尽きていても使用できる。    
\# いうまでもないが、音源として使用する場合はバックアップ電池を交換する必要がある。(交換は基板上の電池を交換することになる)    
1. 音源のEWI3000mのブレスコントール設定をBREATHにする。
今回、使用する音源AriaはEWI用なのでBREATHが有効になっている。
1. 以上でEWI3000を吹くとPCから音が出る。  
1. 吹奏感を調整するためにEWI3000mのBREATH、GLIDE、BENDのツマミを調整する。  
    1. 外側のツマミを目一杯右に回し、次にLEDランプが消える位置まで戻す。  
    1. 内側のツマミでセンサーの閾値を調整する。  


## bluetooth_MIDI接続
以下の手順でワイヤレス(bluetooth-MIDI)にPCとEWI30000m(音源)を接続できる。

以下の手順はiPhone/iPadが必要となる：  
1. 以下のWIDI_Masterを購入する。  
[https://hookup.co.jp/products/cme/widi-master](https://hookup.co.jp/products/cme/widi-master)  
1. WIDI_Masterを音源(EWI3000m)のMIDI-IN/MIDI-OUTに接続する。  
MIDI-OUTから電源を供給する方式なので特に電源アダプタを用意する必要はない。
1. 音源(EWI3000m)をオンにしてWIDI_Masterに電源を供給する。  
1. iPhone/IpadアプリのWIDI_Appをインストールして、(購入直後はファームウェアが古いので)bluetooth経由でファームウェアをアップデートする。  
アップデート開始時は、Updaterというデバイスが出現するので自動的にそのデバイスと接続してデバイスをアップデートする。  
アップデート後はリブートする必要がある。(電源を入れ直す)  
また、アップデートでbluetooth接続ができない場合はiPhoneのbluetooh設定でいったんWIDI_Masterのデバイスを削除すると良い。
1. WIDI_Appでデバイス名は変更できるので複数のWIDI_Masterを使用している場合はデバイス名を変更したほうが良い。リブート後、変更は有効になる。  
1. 以上でWIDI_Masterが有効になる。  

PC側の準備：

1. bluetooth_dongleの購入  
PC内蔵のbluetoothでは動作が非常に不安定だったので、なるべく最近の規格をサポートしているdongleを購入して使用する。  
今回は以下を使用した：  
tp-link UB500  
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

再起動後：
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
1. 以上でAriaとEWI3000がbluetooth-MIDIで接続された状態になる。

## 参考情報

[EWI3000mOperatorsManual.pdf](https://www.patchmanmusic.com/manuals/EWI3000mOperatorsManual.pdf)

[AKAI EWI3000m 操作TIPS(8)](http://highblow.blog40.fc2.com/blog-entry-31.html)  
[AKAI EWI3000m 操作TIPS(9)](http://highblow.blog40.fc2.com/blog-category-5.html)  
[ウィンドシンセ関連での色々なトラブルとその解決法](https://sound.jp/windsynth/sonohoka_kenkyu/trou_shoo.html#anchor13758)  
[windsynth @ ウィキ - EWI3000m](https://w.atwiki.jp/windsynth/pages/34.html)
[EWI3000m音源のメンテ](https://minkara.carview.co.jp/userid/1785339/blog/29600044/)
[EWI3000m 電池交換 ＜その２＞](https://blog.goo.ne.jp/tmisoami/d/20090222)  

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  


ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  


<!--
=============================================
【EWI3020m】
　ご存知アカイ・プロフェッショナル・エムアイ製EWI用音源の現行機種。
　歴代T-SQUAREのサックス奏者の方々もこの音源を使っており、今では珍しいアナログ方式の音源で、その特性から、とても温かみのある音を出すことができます。
　その仕様がモノフォニック（和音が出ず単音のみでしか演奏できない）でエフェクター無し・・・という大変潔い内容ながら、音の太さと圧倒的な存在感はプロのサックス奏者が選ぶウインドシンセ用音源の定番機種となっていることが証明しています。　詳細はこちらをご覧下さい。

（MIDI-INで受信できる情報）

プログラムチェンジ（ただし0～100まで）
アフタータッチ、ブレスコントロール（CC#2）、ボリューム（CC#7）、モジュレーションデプス（CC#1）のいずれかひとつを選択。＜注＞
ピッチベンド
ホールド（サスティンON-OFF＝CC#64）
グライドタイム（ポルタメントタイム＝CC#5）
オートノートOFF（CC#120）
リセットオールコントローラー（CC#121

-->
