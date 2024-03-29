    
# Macことはじめ 

2022/11/23++  
問題点の回避策/対応方法などを追加した。  

2022/11/15+++      
初版    
  
## 概要   
MacBookAirを手に入れた。  
linux/windowsの経験はあるが、初めてのMacになる。  
操作性の違いや最初にやらなければならないことなど、最初に動かすのに必要なものについて纏めた。  
OSは2022年11月時点の最新版(Ventura)になる。  

## ターミナルに入る
[Mac ターミナルの基本的な使い方・操作方法（１）](https://www.webdesignleaves.com/pr/plugins/mac_terminal_basics_01.html)  
上のリンクを参考にして以下を実行する：  
```
Macのターミナルは「アプリケーション」→「ユーティリティ」にあるので
ターミナルのアイコンをダブルクリックするとターミナルが起動する。

# 「macOS Mojave 以前のバージョンではデフォルトのシェルが bash でしたが、
# Catalina 以降のバージョンでは zsh に変更になっています。」という記述があるが、
# 古いバージョンからのアップデートのせいか、bashのままだった。
```

## sudoユーザーになる
シェルとしてlinuxなどと同様にbashを採用しているが、ディレクトリ構成などは異なる。  
最初に問題になるのは、sudoユーザーに設定されていないので、sudoが必要なツールなどがインストールできない。  
そのため、まずは、sudoユーザーになる方法について述べる：  

1.ルートユーザーを有効にする  
注意：システムに影響を与えるので自己責任で実行すること  
[Macでルートユーザを有効にする方法やルートパスワードを変更する方法](https://support.apple.com/ja-jp/HT204012)  
上のリンクを参考にして以下を実行する：  
```
ディレクトリユーティリティを使う：
以下の手順を実行してください。
1.Finder のメニューバーから「移動」>「フォルダへ移動」の順に選択します。
2.「/System/Library/CoreServices/Applications/」と入力するかペーストし、
  「return」キーを押します。
3.開いたウインドウから、ディレクトリユーティリティを開きます。

ルートユーザを有効または無効にする：
「ディレクトリユーティリティ」ウインドウで、鍵のアイコン 鍵のアイコン をクリックして、
管理者の名前とパスワードを入力します。
# ここでユーザー名とパスワードを入力する

* ルートユーザを有効にするには、メニューバーから「編集」>「ルートユーザを有効にする」の順に選択します。
使いたいパスワードを入力します。その後、ルートユーザとしてログインできます。

ルートパスワードを変更する：
「ディレクトリユーティリティ」ウインドウで、鍵のアイコン 鍵のアイコン をクリックして、
管理者の名前とパスワードを入力します。
メニューバーから「編集」>「ルートパスワードを変更」の順に選択します。

ルートユーザとしてログインする：
ルートユーザが有効になっている場合、ルートユーザとしてログインしている間に限り、
ルートユーザの権限を利用できます。

(1)Apple メニュー >「ログアウト」の順に選択し、現在のユーザアカウントからログアウトします。
(2)ログインウインドウで、ユーザ名「root」と、ルートユーザ用に作成したパスワードを使ってログインします。
# rootでログインする

* ログインウインドウに複数のユーザのリストが表示される場合は、「その他のユーザ」をクリックしてからログインします。

* 作業が終わったら、忘れずにルートユーザを無効にしてください。 
→使った印象では自動的にルートユーザーは無効になるようだ。
```

2.ルート(root)でログインする  
bashのシェルに入るので以下のようなコマンドで  
/etc/sudoersのファイルを編集する：  
```
nano /etc/sudoers

このファイルの以下の行を追加する：

apple	ALL=(ALL:ALL) ALL

# ここでappleは実際に使われているユーザーIDとする
```
ログアウトする  

3.ユーザーID(apple)でログインする  
bashのシェルに入るので以下のようなコマンドで  
ログインパスワードを変更する：  

```
security set-keychain-password
```
ログアウトする  

以上で、sudoユーザーが有効になる。  


通常、ユーザーログインパスワードを変更するときは  
以下を参照のこと：  
[Mac - ユーザーのログインパスワードの変更する方法](https://pc-karuma.net/mac-password-change/)  


## brewをインストールする
[【簡単】MacにHomebrewをインストールする方法と基本的な使い方](https://fukatsu.tech/homebrew)   
上を参考にしてインストールする。  
\# 途中で、sudoを実行しているので、パスワードを入力する  


## USBメモリなどを安全に取り外しする
[MacでUSBメモリなどを安全に取り外しする方法](https://decoy284.net/mac-remove-external-disk-from-desktop/)  
上のリンクを参考にする：
```
③メニューバーのファイルから取り外す(ショートカットは「 ⌘ + E 」)
```


## Finderで一番上のディレクトリへ移動する
[【Mac】Finderで一番上のディレクトリへ移動する 3つの方法](http://c-through.blogto.jp/archives/23285815.html#:~:text=Finder%20%E3%82%92%E9%96%8B%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B,%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%8C%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82)  
上のリンクを参考にする：  
```
Finder を開いている状態で上のメニューから「移動」⇒「コンピュータ」などを選択します。
```              

## ディレクトリ構成
[Macのディレクトリ構成を理解する](https://epic-life.me/archives/1914)  
```
/	ルートディレクトリ
/Applications	全ユーザが利用可能なアプリケーションが管理されている
                (windowsでいうProgram Files)
/Users	各ユーザのホームディレクトリが管理されている
        (linuxでいうhomeにあたる/homeはあるが別の用途になっている)
/home -> /System/Volumes/Data/home
/Library	全ユーザが利用可能なアプリケーションで使用される設定が管理されている
/Volumes	ハードディスクやUSBなどの外部記憶媒体と接続する際のマウントポイントとして利用される
/System	OSのファイルが管理されている
/cores	カーネルのコアダンプが保存される
/bin	コマンドラインで使用する必須コマンドが管理されている
/dev	プリンタやマウス等の各種デバイスにアクセスするために使用するファイル類が管理されている
/etc	システム全体用の設定ファイルが管理されている(etc -> private/etc)
/opt	ユーザーがインストールした静的データ、主にプログラムが格納される
/private	/varや/tmp, /etcの実体が管理されている
/sbin	コマンドラインで使用する必須コマンドのうちシステムのメンテナンス等に用いられるコマンドが管理されている
/tmp	一時的に保存するファイルやディレクトリを配置する。再起動や期間で削除される(tmp -> private/tmp)
/usr	ユーザが使用するコマンドやマニュアルが配置されている
/var	ログファイルなどを保存するディレクトリでシステムが利用する
```

## ファイル拡張属性
[Mac: ファイルの拡張属性を一気にはぎ取る](https://qiita.com/__hage/items/467ddef0172f7f92b4ea)   
拡張属性 (EA) とは  
ls -l したときにパーミッションの右側に @ マークがついていることがあります。  
これは HFS Plus (OSX のデフォルトのファイルシステム) の拡張属性 (EA: Extended Attributes) が、そのファイルについていることを示します。  
たとえばメールの添付ファイルを保存したときにどのメールアドレスから、受け取ったファイルなのかとか、そういう情報が記録されています。  

## Documents(文書)
iCloudが有効の場合、iCloud_Drive上にDocumentsディレクトリが作成される。
この中にprocessingのスケッチのディレクトリProcessingが置かれる。 

[Windows用iCloudをダウンロードする](https://support.apple.com/ja-jp/HT204283)  
上のリンクからダウンロートしてインストールすると、
iCloud_DriveでMacとWindowsでデータ共有できる。  

## 仮想MIDIデバイスの設定  
WindowsのloopMIDIと同じような機能を仮想MIDIデバイスとして実現できる：   
「[仮想MIDIバスの設定する](https://help.ableton.com/hc/ja/articles/209774225-%E4%BB%AE%E6%83%B3MIDI%E3%83%90%E3%82%B9%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)」の参考にして、以下のように設定する。  
(日本語にするとトラブルのもとになるので英数のみとすること)

[装置はオンライン]：チェックオン  
装置名：loopMIDI  
ポート：bus1  


## Bluetooth_MIDIデバイスの接続
「[Bluetooth MIDI 接続ガイド](https://cdn.korg.com/jp/support/download/files/66bd712c7c4ca40c46fa26cf1ad97b8e.pdf)」の「■ Mac との接続/OS X Yosemiteの場合」を参照のこと。  

上手く行かない場合、ペアリング済みのせいがあるで、bluetooth設定でペアリングを解除する。  


## OpenFrameworks使用時の注意
以下のような問題があるので回避策を実行のこと：  
「[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)」で、projectGeneratorを使用する際、
```
2022年時点で最新のMacOSを使用している場合、
最初にprojectGeneratorを実行して
エラーになるときは、いったん実行を停止して
以下を実行する：

1.そのprojectGenerater実行ファイルを
別のところにコピーする。
2.オリジナルの場所にあった実行ファイルを削除する。
3.コピーした実行ファイルを削除した場所にコピーする。
4.オリジナルの場所に戻した実行ファイルを実行する

以上のエラーが解消する
```

## スクリーンショット
[Mac でスクリーンショットを撮る
](https://support.apple.com/ja-jp/HT201361)  
```
画面の一部を取り込む方法
1. [shift]+[command]+[4]の3つのキーを同時に長押しします。
2. 十字型のカーソルをドラッグして、画面の取り込みたい部分をドラッグして範囲選択します。
3. 選択範囲を移動するには、スペースバーを押しながらドラッグします。
4. スクリーンショットの撮影をキャンセルするには、[esc](Escape)キーを押します。
```
## デバイスマネージャ 
[Macのwindowsで言うところのデバイスマネージャ](https://takuya-1st.hatenablog.jp/entry/20111118/1321585304)    
上のリンクの内容の操作性が若干変更になっているようで[Appleアイコン/このMacについて]`を選択して、
その状態で[option]を押すと「システム情報...」に変わるのでクリックする。

## 問題点
1.processingのスケッチは実行できない。モードを変えて、p5.jsにすると正常実行できる。  
原因不明  
[Download 4.0.1(August 10, 2022) MacOS(Intel 64-bit)](https://processing.org/download)  
→  
2022/11/23  
回避策：  
グラフィクス初期化の問題でグラフィクスがあるスケッチは表示できないという不具合であり、スケッチの先頭に以下のコードを置くと解決する：  

```java

import com.jogamp.opengl.GLProfile;
{
  GLProfile.initSingleton();
}
```

参照：  
[P3D & P2D window not showing on MacOS Ventura #544](https://github.com/processing/processing4/issues/544)  

2.Mac用VisualCodeをインストールしても、コマンドライン(シェル上)で「code」でVisualCodeが起動できない。  
→  
2022/11/23  
対応方法：  
1.VisualCodeを起動する。    
2.コマンドパレット(Cmd+Shift+P)から「Shell Command:Install 'code' command in PATH command」を検索/実行する。    
3.ターミナルを再起動すると、codeが有効になる。    


参照：  
[Visual Studio Code on macOS](https://code.visualstudio.com/docs/setup/mac)「Launching frovm the command line」  



以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

