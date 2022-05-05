    
# EWI5000でAerophone(AE-20)を外部音源として使用する    

2022/5/5     
初版    
  
## 概要    
Aerophone(AE-20)はMIDI-INはないが、bluetooth-MIDIが利用できるので、
これを使ってEWI5000(+WIDI_Master)とbluetooth-MIDI接続して、AE-20を外部音源にする。
以下に外部音源としての接続方法について説明する。  

## 0. EWI5000のMIDI-OUT設定
1. EWI5000とPCをUSB接続する。
1. PCのEWI5000_Editorを起動する。
1. 画面で「Controller/Breath」を選択して
以下にように設定する：  
Breath(br): Low Resolution(Lr)  
Volume(vo): Low Resolution(Lr)  
Expression(EP): Low Resolution(Lr)  
1. EWI5000_Editorを終了する。  
1. PCとEWI5000とのUSBケーブルを外す。  

以降、この設定で外部音源(AE-20)と接続する。

### 1. bluetooth-MIDI接続
以下の手順でbluetooth-MIDI接続を行う：
1. EWI5000用に1つのWIDI_Masterを用意する。
1. EWI5000のMIDI-OUTにWIDI_Masterを接続する。

以下の手順でEWI5000とAE-20を立ち上げる：
1. WIDI_Masterを接続したEWI5000の電源を入れる。
1. AE-20をbluetooth有効にして電源を入れる。
1. 以上でEWI5000側のWIDI_MasterとAE-20が自動的にペアリングして接続する。   
このとき、EWI5000のWIDI_MasterのLEDは青色からシアン色になる。
1. EWI5000を吹くとAE-20から設定されている音色で音が出る。

### トラブル・シュート
上の手順で音が出ない場合、以下のことが考えられる：
* AE-20のボリューム(音量)が絞ってある。
* EWI5000の送信MIDIチャンネルが1以外になっている。
経験上、誤ってEWI5000の\[SETUP]ボタンなどを押して意図せずに送信チャンネルが1以外になっていることがあった。
* EWI5000がPCとUSBケーブルで接続されたままになっている。
このときは、USB-MIDIのほうが優先的に選択されEWI本体のMIDI-OUTにデータが出力されないようだ。


## 参考情報

WIDI関連：  
[Aerophone(AE-20)にWIDI_uhostを使用する](md/AE-20_WIDI_uhost.md)    
[Aerophone(AE-20)に外部音源(VL70m)を接続する](md/AE-20_VL70m.md)    
[EWI5000に外部音源(VL70m)を接続する](md/EWI5000_VL70m.md)    
[Aerophone(AE-20)に外部音源(EWI3000m,Aria/Windows)を接続する](md/AE-20-ExternalAria.md)    
[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](md/EWI5000_EWI-Aria.md)    
[EWI5000ことはじめ](md/EWI5000_EWI-GetStarted.md) 
[EWI3000をEWI-USB(もどき)として使う(Aria/Windows編)](md/EWI3000_EWI-Aria.md)   
[EWI3000をEWI-USB(もどき)として使う(iPhone/iPad編)](md/EWI3000_EWI-USB.md)   

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

