    
# EWI5000をソフト音源(IFW)と接続する   

2022/5/27     
初版    
  
## 概要    
EWI5000(+WIDI_Master)をウィンド・コントローラ(EWIなど)用のソフト音源(IFW)とbluetooth-MIDIでPC(windows)と接続する。

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

### 2.ソフト音源(IFW)をインストールする
1. 以下のリンクを参考にIFWをダウンロードして解凍する  
[IFWコミュの配布情報](https://mixi.jp/view_bbs.pl?comm_id=5620149&id=62193318)  
\# 2022年5月時点の最新版は、IFW_1.0.b39.zip のようだ  
1. VSTPlugInのフォルダにコピーする
    1. 「C:\Program Files\VSTPlugIn」を(存在していないなら)作成する
    1. 解凍後のIFW_1.0.b39(フォルダ)の中のIFW(フォルダ)をVSTPllugInの中にコピーする

### 3.VST_HOSTをインストールする
1. 以下のurlからダウンロードして解凍する 
https://www.hermannseib.com/programs/vsthostx86.zip  
\# 64ビット版もあるが、互換性の考慮から上の32ビットを使用する  
\# たとえば、IFW(VSTi)は、64ビット版では動作しない  
1. 解凍したvsthostx86(フォルダ)を「C:\Program Files」にコピーする  
1. 起動しやすくするために上のフォルダにあるvsthost.exeのショートカットを作り、ディスクトップに置く  

### 4.VST_HOSTを起動する
1. vsthost.exeのショートカットをクリックして起動する
1. VSTフォルダを設定する
    1. \[File/Set Plugin Path...]を選択する
    1. 入力欄「C:\Program Files\VSTPlugIn\IFW\win」を入力する
    1. \[OK]をクリックする
1. 使用したいVSTを選択する
    1. \[File/Plugin]を選択して選択肢を表示する
    1. \[IFW]を選ぶ
1. MIDIデバイスを選択する
    1. \[Device/MIDI]を選択してデバイス名を表示する
    1. \[WidiBud]を選ぶ(bluetooth-MIDIを使用する場合)
    (USB接続の場合、\[EWI5000]を選ぶ)  
1. WAVEデバイスを選択する
    \[Device/Wave]を選択して以下に設定する  
    * Output Port: ASIO: ASIOALL v2  
    * Sample Rtae: 44100  
    * Buffer: 64 samples (音が途切れるようなら大きくする)
1. VST画面を表示する
    1. 右上の右から3番目アイコンをクリックするとVST画面が表示される
    1. 画面の中の[LOAD]を押して音色ファイル(たとえば、Sound/ysmm/IFW_JUDD.xml)を選択する 
    1. 音色「IFW_JUDD」がロードされる。  

以上でEWIと音源が接続された状態になるので、EWIを吹くとPCから音が出る。  
吹いても音がしない場合、\[Engine/Run]でVSTを(再)起動する。  

### Mute/Thru機能
* 右側のスピーカ・アイコンでMuteのon/offができる
 (「X」はMuteの状態を表す)
* 左側のスピーカ・アイコンでThruのon/offができる  
 (「-」はThruの状態を表す)

### トラブル・シュート
上の手順で音が出ない場合、以下のことが考えられる：
* EWI5000の送信MIDIチャンネルが1以外になっている。
経験上、誤ってEWI5000の\[SETUP]ボタンなどを押して意図せずに送信チャンネルが1以外になっていることがあった。
* (bluetooth-MIDIで使用する際)EWI5000がPCとUSBケーブルで接続されたままになっている。  
このときは、USB-MIDIのほうが優先的に選択されEWI本体のMIDI-OUTにデータが出力されないようだ。

## AE-20に関する補足
Aerophone(AE-20)も上の説明で「EWI5000(+WIDI_Master)」の部分をAE-20に読み替えた形で同様のことが可能である。

## 参考情報
IFW関連：  
[IFW](https://dic.nicovideo.jp/a/ifw)    
[よしめめさんによる高性能無料ソフトウエアシンセサイザーIFWの解説 #EWI](https://togetter.com/li/1256334)   

VST_HOST関連：  
[VSTHost](https://www.hermannseib.com/english/vsthost.htm)  
[VSTHost取説](https://www.hermannseib.com/documents/VSTHost.pdf)  

WIDI関連：  
[EWI5000をWIDI_Bud経由で外部音源(Aria/Windows)と接続する](https://xshigee.github.io/web0/md/EWI5000_WIDI_Bud.html)  
[EWI5000にSWAM音源(@iPad)を接続する](https://xshigee.github.io/web0/md/EWI5000_SWAM.html)  
[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](EWI5000_EWI-Aria.md)    
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
[CME WIDI BUD-- BLE MIDI adapter for any BLE MIDI devices](https://xkeyair.com/widi-bud/)  
[WIDI BUDってなんだ？](https://dirigent.jp/blog/widi-bud%E3%81%A3%E3%81%A6%E3%81%AA%E3%82%93%E3%81%A0)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

