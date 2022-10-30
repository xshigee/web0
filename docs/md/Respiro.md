
# Respiro(VST3)を使ってみる

2022/10/30      
初版    
  
## 概要    
wind_controler用のVST3プラグインのRespiroをインストールして使ってみる。  
wind_controlerとして、EWI5000とre.corderを接続してみた。   
生楽器的な音源でブレスセンサの値に敏感に反応して音色のニュアンスが変わり吹いていて面白い印象がある。


## Respiro購入(165 EUR) 
[https://www.imoxplus.com/site/](https://www.imoxplus.com/site/)  
上のホームページから購入したいプラグインをカートに入れ、クレジットカードで購入できる。
\# あらかじめ、アカウントを登録する必要がある  
購入時に(アカウント登録の)電子メールを設定するので、そのメールアドレスに対して、ダウンロートURL「Status of you order:Pending」の電子メールが送られてくる。

    
## ダウンロード/インストール

1. ダウンロード/インストール  
上で入手したダウンロードアドレスから購入プラグイン(.zip)をダウンロートし、解凍してインストールする。(WindowsとMacでurlが異なるので必要なものをダウンロードする)  

2. 該当pluginのコピー  
プラグイン・インストール後、VSTが以下に置かれるので  
「C:\\Program Files\\Common Files\\VST3\\Respiro.vst3」  
自分の環境に合わせてプラグインを適切な場所にコピーする。  

(例)  
自分の環境では「C:\\Program Files\\VSTPlugIn」にプラグインを置いているので  
ここに「C:\\Program Files\\Common Files\\VST3\\Respiro.vst3」をコピーした。

なお、スタンドアロンのアプリとして以下にインストールされる。  
C:\\Program Files\\Imoxplus\\Respiro\\Respiro.exe     

## Respiro実行

1.Respiroプラグインを設定する。  
「[EWI5000をソフト音源(IFW)と接続する](https://xshigee.github.io/web0/md/EWI5000_IFW.html)」を参考にEVI-NERプラグインを設定する。  
(IFWの部分をRespiroに読み替える)  

2. vsthost.exeを実行してRespiroプラグインを立ち上げる。
最初の実行時は、電子メールとパスワードの入力欄が現れるので アカウント登録時のものを入力する。  

3. これでwind_controlerを吹くと音が出る状態になる。  
  
マニュアルは画面のアイコン[?]/Manualをクリックするとpdfが表示できる。  
  
Respiro画面：  
![Respiro VST](PNG/Respiro_01.png)  

EWI5000とre.corderを接続して音が出ることを確認した。  

EWI5000のMIDI-OUT設定は  
「[EWI5000に外部音源(EWI3000m,Aria/Windows)を接続する](https://xshigee.github.io/web0/md/EWI5000_EWI-Aria.html)」
のMIDI-OUT設定を採用した。  

re.corderのMIDI-OUT設定は  
「[re.corder/Elefueに外部音源(Aria/Windows)を接続する(WIDI_Bud_Pro経由)](https://xshigee.github.io/web0/md/re.corder_Aria.html)」
のMIDI-OUT設定を採用した。    
                                                                
## 参考情報  
re.corder関連：  
[owner’s manual re.corder](http://www.artinoise.com/wp-content/uploads/2021/02/artinoise-recorder-manual-ENG-v10.pdf)  
[re.corder Downloads](https://www.recorderinstruments.com/en/support-downloads/)  
[re.corder Frequently Asked Questions](https://www.recorderinstruments.com/en/frequently-asked-questions/)    

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Midi View](https://hautetechnique.com/midi/midiview/)   


ASIO関連：  
[asio4all - ASIOドライバーのないオーディオインターフェイスをASIO対応にできるソフト](https://forest.watch.impress.co.jp/library/software/asio4all/)

Aria関連：  
[EWI MASTER BOOK CD付教則完全ガイド【改訂版】](https://www.alsoj.net/store/view/ALEWIS1-2.html#.YmNpctpBxPY)のp100-p119の音色の設定方法がある

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

