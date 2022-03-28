    
# EWI3000をEWI-USB(もどき)として使う(iPhone編)    

2022/3/28+      
初版    
  
## 概要    
大昔のEWI3000(音源モジュール：EWI3000m)をEWI-USBとして使う方法について記する。
音源モジュールのEWI3000mはMIDI-IN/OUTの端子があるので、なにかしらの方法で外部音源を接続できれば、それを利用して音を出すことができる。
  
## 必要な機材
* iPhone  
ソフト音源として使用する
* [Apple Lightning USB-3 カメラアダプタ (MK0W2AM/A)](https://www.apple.com/jp/shop/product/MK0W2AM/A/lightning-usb-3%E3%82%AB%E3%83%A1%E3%83%A9%E3%82%A2%E3%83%80%E3%83%97%E3%82%BF) 
ライトニング-USB変換アダプターになる  
* [Buffalo BSH4U110U3WH (USB3.0対応 バスパワーハブ 上挿し 4ポートタイプ)](https://www.buffalo.jp/product/detail/bsh4u110u3wh.html)  
たぶん、USBバスパワーハブであれば、ほかのもので良い。  
* [Roland UM-ONE-MK2 (USB MIDI Interface)](https://www.roland.com/jp/products/um-one_mk2/)  
MIDI IN/OUTをUSBに変換するアダプター(これが定番らしい)  
* [CREATIVE Sound Blaster Play! 3 (Windows/Mac対応)USBオーディオインターフェース](https://jp.creative.com/p/sound-blaster/sound-blaster-play-3)  
なくてもかまわない。その場合、iPhone本体から音がでる。音質重視なら、あったほうが良い。
* [スイッチングＡＣアダプター１５Ｖ１．２Ａ　１００Ｖ～２４０Ｖ　ＧＦ１８－ＵＳ１５１２－Ｔ(GF18-US1512-T)](https://akizukidenshi.com/catalog/g/gM-02195/)  
EWI3000m用代替ACアダプター  
純正のACアダプターを紛失したので、その代わりのACアダプター。もちろん、純正があるなら不要。

## 必要なソフトウェア  
* [KORG Gadget 2](https://www.korg.com/jp/products/software/korg_gadget/)
これをiPhoneにインストールする。    
末尾に「Le」が付く評価版もあるので、試しに使用する場合は、それを使用する。

## 接続
1. 「Lightning USB-3 カメラアダプタ」をiPhoneに接続する。  
(ライトニング入力端子は電力供給用なのでライトニングACアダプターに接続する)  
1. カメラアダプタのUSB端子とUSBハブを接続する。  
1. USBハブとUM-ONE-MK2を接続する  
1. UM-ONE-MK2のMIDI-OUT[CONNECT TO MIDI IN]をEWI3000mのMIDI-INに接続する。
1. UM-ONE-MK2のMIDI-IN[CONNECT TO MIDI OUT]をEWI3000mのMIDI-OUTに接続する。 
   今回の場合、EWI3000mからiPhoneにMIDI信号が流れることがないので接続しなくてもかまわない。
1. EWI3000mとACアダプターを接続する。

## 起動                     
1. EWI3000mのバックアップ電池は電池寿命が尽きていてバックアップできていないので、起動時は、工場出荷時の設定に初期化する必要がある。それには、「MIDI」と「UP」ボタンを同時押しで電源ONする。  
\# 音源としてではなく、MIDIコンバータとして使用するには、
バックアップ電池が尽きていても使用できる。    
\# いうまでもないが、音源として使用する場合はバックアップ電池を交換する必要がある。(交換は基板上の電池を交換することになる)    
1. 以上で、とりあえず、EWI3000を吹くとiPhone(KORG Gadget 2)から音が出る。  
1. 吹奏感を調整するためにEWI3000mのBREATH、GLIDE、BENDのツマミを調整する。  
    1. 外側のツマミを目一杯右に回し、次にLEDランプが消える位置まで戻す。  
    1. 内側のツマミでセンサーの閾値を調整する。  


## 参考情報

[EWI3000mOperatorsManual.pdf](https://www.patchmanmusic.com/manuals/EWI3000mOperatorsManual.pdf)

[AKAI EWI3000m 操作TIPS(8)](http://highblow.blog40.fc2.com/blog-entry-31.html)  
[AKAI EWI3000m 操作TIPS(9)](http://highblow.blog40.fc2.com/blog-category-5.html)  
[ウィンドシンセ関連での色々なトラブルとその解決法](https://sound.jp/windsynth/sonohoka_kenkyu/trou_shoo.html#anchor13758)  
[windsynth @ ウィキ - EWI3000m](https://w.atwiki.jp/windsynth/pages/34.html)
[EWI3000m音源のメンテ](https://minkara.carview.co.jp/userid/1785339/blog/29600044/)
[EWI3000m 電池交換 ＜その２＞](https://blog.goo.ne.jp/tmisoami/d/20090222)  

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
