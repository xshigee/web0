    
# Aerophone(AE-20)に外部音源(VL70m)を接続する    

2022/5/2      
初版    
  
## 概要    
Aerophone(AE-20)には、MIDIコネクタがないが、USBとbluetoothがあるので、それを使って外部音源を接続することができる。  
以下に音源の接続方法について説明する。  

### 0. AE-20のMIDI-OUT設定
1. bluetooth接続の「Aerophone Pro Editor」(iPhone/iPad)を起動して、EDITOR/MIDI_OUTに入り、Breathに(1と2は定義済なので)3として\[CC07:VOLUME]を追加する。
\# 1は\[CC11:EXPRESSION]、2は\[CC02:BREATH]として定義済みである。
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


## VL70mの場合

### 0. VL70mのハード設定
1. HOST_SELECTをMIDIにする。
スイッチが軽いので意図せず別の位置にずれていたことがあったので確認のこと。
1. 前面のPHONESにヘッドフォンを接続する。

### 1. bluetooth-MIDI接続
1. 1つのWIDI_Masterを用意する。
[WIDI_Master](https://hookup.co.jp/products/cme/widi-master) 
1. VL70mのMIDI-OUT/MIDI-INの両方にWIDI_Masterを接続する。(実際に必要なものはMIDI-INのみだが電源を供給するためにMIDI-OUTも接続する)

以下の手順でAE-20とVL70mを立ち上げる：
1. 周りにあるスマフォやPCのbuletoothをオフにする。
特に「Aerophone Pro Editor」をインストールしてあるiPhone/iPadは、bluetoothをオフにする。理由として、bluetoothの意図しない接続を回避するためにそうする。
1. AE-20の電源を入れる。
1. VL70mの電源を入れる。
1. 分かりやすい音色として以下を選択する：  
「WX Shaku ▷Pr2▶055」
または  
「Oboe!2 ▷Pr2▶091」
1. AE-20を吹くとVL70mから音が出る。  
LCD表示のBCのバーグラフ表示が吹く強さにより左右に動くので、参考にする。


WIDI_Masterのファームウェア・アップデートする場合： 
購入直後のファームウェアでも動作すると思うが最新ファームウェアにアップデートする場合は以下の手順で行なう.

以下の手順はiPhone/iPadが必要となる：  
   1. WIDI_MasterをVL70mのMIDI-OUTに接続する。  
MIDI-OUTから電源を供給する方式なので特に電源アダプタを用意する必要はない。
   1. VL70mをオンにしてWIDI_Masterに電源を供給する。  
   1. iPhone/IpadアプリのWIDI_Appをインストールして、(購入直後はファームウェアが古いので)bluetooth経由でファームウェアをアップデートする。  
アップデート開始時は、Updaterというデバイスが出現するので自動的にそのデバイスと接続してデバイスをアップデートする。  
アップデート後はリブートする必要がある。(音源の電源を入れ直す)  
また、アップデートでbluetooth接続ができない場合はiPhoneのbluetooh設定でいったんWIDI_Masterのデバイスを削除すると良い。
    1. WIDI_Appでデバイス名は変更できるので複数のWIDI_Masterを使用している場合はデバイス名を変更したほうが良い。リブート後、変更は有効になる。  
    1. 以上でWIDI_Masterが有効になる。


## VL70mの音色設定
* プリセット２がウィンド・コントローラ向けのようなので、これを選択する。
* プリセット１にあるVTと表示される音色はBCが無効になっているので音色ごとの設定になるがコントロールエディットのExp ModeをBCにする。  
もともとウィンド・コントローラ向けの音色ではないが、この設定で音が出るようになる。  
なお、そのまま使用するなら、Internalメモリに保存する必要がある。

## VL70mのバッテリ交換
VL70mがかなり昔の製品で内蔵バッテリが電池残量がない場合は、バッテリを交換する。
以下が、その手順になる。

1. 以下を参考にバッテリを交換する。
[Yamaha VL70-m のバッテリー(CR2450)交換](https://mylife-blog.com/post-2351)
1. 以下によりファクトリーリセットを行なう、  
UTIL/INITIAL/FactSet  
1. 以下によりシステムの初期化を行なう。  
UTI/INITIAL/SysInit  

記号の解説：  
* 「/」は、\[SELECT+/-]や\[ENTER]を押して「/」の右側の項目を選ぶことを意味する。
* 選択した最終項目の実行はYesの意味で\[ENTER]を押す。
* 取り消す場合は\[EXIT]を押す。

## VL70mのACアダプター
純正のものを紛失したこととWIDI_Masterを動作させるためには電流の多少大きいものが必要なので以下を使用する。

[スイッチングＡＣアダプター １２Ｖ３Ａ　ＡＤ－Ａ１２０Ｐ３００](https://akizukidenshi.com/catalog/g/gM-10661/)  

たぶん、もう少し電流の小さいものでも良いと思う。

## 参考情報

VL70m関連：  
[VL70m取扱説明書](https://jp.yamaha.com/files/download/other_assets/4/316804/VL70mJ1.pdf)  
[VL70m リストブック](https://jp.yamaha.com/files/download/other_assets/5/316535/VL70mJ2.pdf)   
[VL70-mの基本設定](http://wx.jazzsynth.com/pages/c010_030vlsettei.html)            

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Pocket MIDI](https://www.microsoft.com/ja-jp/p/pocket-midi/9ntv7mflbbvx?activetab=pivot:overviewtab)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  
