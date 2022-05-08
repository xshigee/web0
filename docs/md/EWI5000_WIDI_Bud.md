    
# EWI5000をWIDI_Bud経由で外部音源(Aria/Windows)と接続する  

2022/5/7+     
初版    
  
## 概要    
EWI5000(+WIDI_Master)をbluetooth-MIDIでPC(windows)と接続できるが  
以下のリンクにあるやり方ではbluetooth接続が不安定であるので  
・[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](EWI5000_EWI-Aria.md)    
新たに以下のリンクにあるWIDI_BudというUSB-dongleをPCに刺して、より安定したbluetooth-MIDI接続が利用できる。

・[CME WIDI BUD-- BLE MIDI adapter for any BLE MIDI devices](https://xkeyair.com/widi-bud/)  
・[WIDI BUDってなんだ？](https://dirigent.jp/blog/widi-bud%E3%81%A3%E3%81%A6%E3%81%AA%E3%82%93%E3%81%A0)  

### 0. EWI5000のMIDI-OUT設定
1. EWI5000とPCをUSB接続する。
1. PCのEWI5000_Editorを起動する。
1. 画面で「Controller/Breath」を選択して  
以下にように設定する：  
Breath(br): Low Resolution(Lr)  
Volume(vo): Low Resolution(Lr)  
Expression(EP): Low Resolution(Lr)  
1. EWI5000_Editorを終了する。  
1. PCとEWI5000とのUSBケーブルを外す。  

### 1. bluetooth-MIDI接続
以下の手順でbluetooth-MIDI接続を行う：
1. EWI5000用に1つのWIDI_Masterを用意する。
1. EWI5000のMIDI-OUTにWIDI_Masterを接続する。

以下の手順でEWI5000とPCを立ち上げる：
1. WIDI_Masterを接続したEWI5000の電源を入れる。
1. PCはWIDI_Budを刺して、特に設定なしで起動できる。
1. 以上でEWI5000側のWIDI_MasterとPCのWIDI_Bugが自動的にペアリングして接続する。   

### 2.外部音源の設定
1. ソフト音源Ariaを立ち上げる。
1. Tools/Preferenceを選択して以下を設定する：
    * Input MIDI Device: WidiBud(in)
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
1. 以上で、EWI5000を吹くとPCから音が出る。

## WIDI Plus
以上のように特に設定なしでWIDI_Budが使用できるが、WIDI_Plusを導入することで、ファームウェア・アップデートと接続先の指定ができるようになる。

以下の手順んで、WIDI_Plusが使用できる：
1. 以下からプログラムをダウンロートして(解凍して)インストールする。  
[win版ダウンロードリンク](https://www.cme-pro.com/xkey/WidiPlus/WidiPlusInstaller.zip)  
1. WIDI_Plusを起動すると以下の２つのタブが表示される。
    * [WidiBud USB]
このタブではファームウェアのアップデートが [Check Firmware]を押すことで可能となる。
    * [Bluetooth]
      1. このタブでは現在接続可能なデバイス名が表示される。
      1. 期待しているデバイス名がないときは、Action欄の[Disconnect&Scan]を押して再スキャンする。
      1. 希望のデバイス名が表示されたら、Action欄の[Connect]を押す。

### トラブル・シュート
上の手順で音が出ない場合、以下のことが考えられる：
* EWI5000の送信MIDIチャンネルが1以外になっている。
経験上、誤ってEWI5000の\[SETUP]ボタンなどを押して意図せずに送信チャンネルが1以外になっていることがあった。
* EWI5000がPCとUSBケーブルで接続されたままになっている。  
このときは、USB-MIDIのほうが優先的に選択されEWI本体のMIDI-OUTにデータが出力されないようだ。

## AE-20に関する補足
Aerophone(AE-20)も上の説明で「EWI5000(+WIDI_Master)」の部分をAE-20に読み替えた形で同様のことが可能である。

## 参考情報

WIDI関連：  
[EWI5000でAerophone(AE-20)を外部音源として使用する](EWI5000_ExtAE-20.md)    
[Aerophone(AE-20)にWIDI_uhostを使用する](AE-20_WIDI_uhost.md)    
[Aerophone(AE-20)に外部音源(VL70m)を接続する](AE-20_VL70m.md)    
[EWI5000に外部音源(VL70m)を接続する](EWI5000_VL70m.md)    
[Aerophone(AE-20)に外部音源(EWI3000m,Aria/Windows)を接続する](AE-20-ExternalAria.md)    
[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](EWI5000_EWI-Aria.md)    
[EWI5000ことはじめ](EWI5000_EWI-GetStarted.md) 
[EWI3000をEWI-USB(もどき)として使う(Aria/Windows編)](EWI3000_EWI-Aria.md)   
[EWI3000をEWI-USB(もどき)として使う(iPhone/iPad編)](EWI3000_EWI-USB.md)   

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

