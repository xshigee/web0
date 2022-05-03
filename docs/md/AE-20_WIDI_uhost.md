    
# Aerophone(AE-20)にWIDI_uhostを使用する    

2022/5/3      
初版    
  
## 概要    
WIDI_uhostは、USB-MIDIをbluetooth-MIDIに変換するアダプターであるがAE-20に使ってみる。  
既にAE-20はbluetooth-MIDIを内蔵しているので、これを使う意味があるのか疑問に持つかもしれないが、
接続性の相性でWIDI_uhostを使用したほうが接続性が良いことがある。  

具体例として、EWI3000mとAE-20をbluetooth-MIDIで接続した場合、
AE-20内蔵のbluetooth-MIDIの場合、EWI3000mからAE-20へMIDIを流すことができなかった。  
(つまり、AE-20を外部音源にしてEWI3000でウィンド・コントローラとして制御することができなかった)  
これが、WIDI_uhostを使用すると、解消した。  

### AE-20とWIDI_uhostの接続
1. AE-20と(WIDI_uhostの)USB_Host/DeviceをUSBで接続する。   
(両端USB-Cのケーブル)
1. (WIDI_uhostの)USB_PowerをUSB-CのACアダプターに接続する。  
1. AE-20を起動してシステム設定を以下のように変更する：
   * Menu System/Bluetooth: off
   * Menu System/USB Driver: Generic
1. 設定が完了したら、AE-20を再起動する。
1. 以上で内蔵のbluetooth-MIDIの代わりにWIDI_uhostによるbluetooth-MIDIが有効になる。

あとは、外部音源(iPhone/iPad)などをbluetooth-MIDI経由で接続できる。

### EWI3000m(+WIDI_Master)をbluetooth-MIDIで接続した場合
* AE-20を吹くとウィンド・コントローラとして動作して、
EWI3000M側の音源の音が鳴る。
* 逆方向として、EWI3000をウィンド・コントローラとして吹くと
AE-20が音源として鳴る。


## 参考情報

WIDI関連：  
[WIDI uhost](https://hookup.co.jp/products/cme/widi-uhost)  
[WIDI Master](https://hookup.co.jp/products/cme/widi-master)  

bluetooth-MIDI関連：  
[Aerophone(AE-20)に外部音源(VL70m)を接続する](md/AE-20_VL70m.md)    
[EWI5000に外部音源(VL70m)を接続する](md/EWI5000_VL70m.md)    
[Aerophone(AE-20)に外部音源(EWI3000m,Aria/Windows)を接続する](md/AE-20-ExternalAria.md)    
[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](md/EWI5000_EWI-Aria.md)    
[EWI3000をEWI-USB(もどき)として使う(Aria/Windows編)](md/EWI3000_EWI-Aria.md)   
[EWI3000をEWI-USB(もどき)として使う(iPhone/iPad編)](md/EWI3000_EWI-USB.md)    
 
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  
