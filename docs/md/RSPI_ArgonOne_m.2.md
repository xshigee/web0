    
# ArgonONE_m.2のSSDにOSを書き込む  

2023/9/25      
初版    
  
## OS書き込み方法  
RaspberryPiのケース[Argon One M.2](https://www.sengoku.co.jp/mod/sgk_cart/detail.php?code=EEHD-5PL4)のSSDにOSを書き込む方法について記述する。  
Argon One M.2はM.2_SATA_SSDを内蔵できるケースで、このSSDにOSを書き込み、SD無しでSSDからブートすることができる。  

手順の概要としては：
まずmicroSDでブートして、OSアプリである[Raspberry Pi Imager]で以下の処理を行う：
1. SSDをフォーマットする。  
1. OSをSSDに書き込む。  
この際、設定アイコンでSSDでブートするOSに必要な設定を予め設定できる。
1. USBbootを設定する。
1. RaspberryPiの電源を落とす。
1. microSDを外す。
1. 再度、電源を入れて、SSDからブートする。


ハードの設定としては以下にする：
1. USB3Bridgeで本体とSSDを接続しておく。
1. あとでmicroSDを外すので、底板のネジは止めないでおく。(SSDブートできるようになったら底板のネジは止めても良い)

Imagerの詳細は以下を参照のこと：  
[Raspberry Pi4をSSDから起動する ～新規インストール編～](https://pokug.net/entry/2020/12/11/074841)


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

