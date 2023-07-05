    
# Mac(M2)ことはじめ 

2023/7/5      
初版    
  
## 概要   
本記事は[Macことはじめ](https://xshigee.github.io/web0/md/Mac_beginner.html)の続編にあたり、前の記事では中古のMacBookAir(Intel版)での記述だったが、今回は、新品のMacBookAirのCPUがM2のものの記述になる。前回の記事と同じ内容の部分は、そのままコピーして載せている。
操作性の違いや最初にやらなければならないことなど、最初に動かすのに必要なものについて纏めた。  

## rosetta2
前のMacBookAir(Intel版)と異なりCPUがARMベースのM2になり、Intel系コードもrosetta2で自動的にインテルコードをARMコードに変換して実行している。  
実行形式がUniversalの場合、Intel系とARM系のコードの両方を持っており、通常は自動的にARMが選択されて実行される。  
そのアプリのプラグインが従来のIntel系の場合、自動的にARMが選択されて実行された場合、プラグインが動作しないことがあるので、アプリの情報で「Rosettaを使用して開く」を設定することにより、あえてIntel系のコードが実行され、それに関係したプラグインも正常動作することになる。この設定が必要となるものとして、GarageBand(Universal)、MainStage(Universal)などがある。

アプリの情報を表示するには、アプリのアイコンをポイントして、controlを押しながらクリックするとメニューが出現するので、その中から「情報を見る」を選択する。

## ターミナルに入る
[Mac ターミナルの基本的な使い方・操作方法（１）](https://www.webdesignleaves.com/pr/plugins/mac_terminal_basics_01.html)  
上のリンクを参考にして以下を実行する：  
```
Macのターミナルは「アプリケーション」→「ユーティリティ」にあるので
ターミナルのアイコンをダブルクリックするとターミナルが起動する。
```
shellは前回と異なるzshになる。

実行例：  
```
~ % echo $SHELL
/bin/zsh

~ % uname -a
Darwin MacBookAir 22.5.0 Darwin Kernel Version 22.5.0: Thu Jun  8 22:21:34 PDT 2023; root:xnu-8796.121.3~7/RELEASE_ARM64_T8112 x86_64

~ % date
2023年 7月 5日 水曜日 12時23分07秒 JST

~ % locale
LANG="ja_JP.UTF-8"
LC_COLLATE="ja_JP.UTF-8"
LC_CTYPE="ja_JP.UTF-8"
LC_MESSAGES="ja_JP.UTF-8"
LC_MONETARY="ja_JP.UTF-8"
LC_NUMERIC="ja_JP.UTF-8"
LC_TIME="ja_JP.UTF-8"
LC_ALL=

```

## sudoユーザーになる
前回のMacBookAir(Intel版)ではsudoユーザーが設定されていなかったが、今回のMacBookAir(M2)では、すでにsudoユーザーが設定されていた。

## テキストエディタ
AppStoreからシンプルなCotEditorをインストールする。

コマンドライン「cot」でエディタを起動させるために以下に実行してパスを設定する：  

```bash
mkdir /usr/local/bin/
ln -s /Applications/CotEditor.app/Contents/SharedSupport/bin/cot /usr/local/bin/cot
```

仕様として新規ファイルを開けないので、新規ファイルを編集する場合は以下のコマンドで新規ファイルを作成する：  

```bash
touch newfile.txt
cot newfile.txt
```

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

注意：  
bluetooth_MIDIの場合、ペアリング情報が他のマシンに残っていると接続できなくなるので、接続できない場合、周辺のマシンのペアリング状況を確認してペアリング情報を消去する。 

## dotnet
C#のビルドにはdotnetを利用する。  
詳細は以下を参照のこと：  
[dotnetでC#を動かす(ver2,Mac対応)](https://xshigee.github.io/web0/md/dotnet_Cs2.html)  

## OpenFrameworks使用時の注意
以下のような問題があるので回避策を実行のこと：  
「[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)」で、projectGeneratorを使用する際、
```

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
## 実行形式のエリアス(ショートカット)

```
% cd bin/CCMapper3KP.app/Contents/MacOS 
% ls
CCMapper3KP
% file CCMapper3KP 
CCMapper3KP: Mach-O 64-bit executable x86_64
# これが実行形式になる。
```

このファイルを選択して、メニューバーの「ファイル」メニューより「エイリアスを作成」を実行するとエイリアスを作成することができる。

注意：  
bin配下のxxxx.appの内容(Contents)を確認するためにはメニューから「パッケージの内容を表示」を選択する。
 
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
1.Mac用VisualCodeをインストールしても、コマンドライン(シェル上)で「code」でVisualCodeが起動できない。  
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

