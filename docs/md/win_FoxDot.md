    
# windowsにFoxDotをインストールする  

2023/4/13  
linuxでの対応について記載する。  

2023/3/31        
初版    
  
## 概要  
windowsにFoxDotをインストールする。   
FoxDotは、SuperColliderへ接続するPythonプログラミング環境で  
pythonでSuperColliderの音源の音を鳴らすことができる。  

## SuperColliderのインストール
1. windowsの場合  
まずは、音源であるSuperColliderを以下のURLからダウンロードしてインストールする。  

[https://github.com/supercollider/supercollider/releases/download/Version-3.13.0/SuperCollider-3.13.0_Release-x64-VS-3188503.exe](https://github.com/supercollider/supercollider/releases/download/Version-3.13.0/SuperCollider-3.13.0_Release-x64-VS-3188503.exe)  

起動は、メニューから以下を選択する：  
SuperCollider-3.13.0  

2. linuxの場合  
以下を参照にしてビルド＆インストールする：  
[SuperColliderをビルドする](https://xshigee.github.io/web0/md/build_sc.html)  

## pythonの再インストール
最新版だとDoxDotが動作しなかったので「Python 3.10.10」をインストールする。  

1. windowsの場合  
別のバージョンがインストール済みの場合、アンインストールして、  
以下のURLからダウンロートしてインストールする。  

[https://www.python.org/ftp/python/3.10.10/python-3.10.10-amd64.exe](https://www.python.org/ftp/python/3.10.10/python-3.10.10-amd64.exe)  

2. linuxの場合
以下を参考にインストールする：  
[UbuntuにPython 3.10をインストールする方法](https://codechacha.com/ja/python-install-python-3-10/)  
\# この場合、コマンド名を別名にするので既存のものをアンインストールする必要はない。  
以下を実行する：  
```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.10
# インストールが完了したら、
# 以下のようにインストールされていることを確認する。
python3.10 --version  
3.10.3

# FoxDotを起動する場合は以下を実行する
python3.10 -m FoxDot

```

python3.10を動かしたとき、tkinterでエラーになる場合、
以下をインストールする：  
```
sudo apt install python3-tk

```

## SuperCollider側FoxDotのインストール

SuperColliderを立ち上げて、  
```
Quarks.install("FoxDot")
```  
と入力する。([Ctrl]+[Enter]で実行)  

これでエラーが出た場合は  
```
Quarks.install("https://github.com/Qirky/FoxDotQuark.git")
Quarks.install("https://github.com/supercollider-quarks/BatLib.git")
```
と打ち込み直接ダウンロードし、インストールする。

その後、SuperColliderを再起動する。

## windows側FoxDotのインストール

以下を実行してFoxDotをインストールする：
```
pip install FoxDot
```

## FoxDotの実行
以下を実行する：

1.SuperColliderを起動する。
2.SuperColliderのコンソールから以下を入力して実行する：
```
FoxDot.start
```

3.PowerShellで以下を実行する：
```
python -m FoxDot
# linuxの場合、python3.10 -m FoxDot
```
FoxDotの画面が開き、FoxDotが実行できるようになる。
使い方の詳細は[参考情報]を参照のこと。

## 参考情報 
FoxDot関連：  
[Pythonで始めるアルゴレイヴ入門](https://www.techscore.com/blog/2019/12/22/algorave-python/)  
[FoxDot - Live Coding with Python v0.8](https://github.com/Qirky/FoxDot)  
[FoxDot（音楽用ライブコーディング環境）をインストール](https://qiita.com/Hulc_0418/items/ba3e94633e465f7201d0)  
[Python＆SuperColliderで奏でる音楽ライブコーディング環境「FoxDot」をセットアップ（インストール）する方法！](https://blog.creative-plus.net/archives/8633)  
[FoxDotの「超基礎」第一弾！「テンポ設定＆サンプルを鳴らす＆シンセを鳴らす」で遊び始めろ！](https://blog.creative-plus.net/archives/8663)  
[Pythonでライブコーディングできると聞いて、FoxDotを触ってみた](https://blog.mtb-production.info/entry/2019/09/17/151840)  

SuperCollider関連：   
[SuperCollider](https://supercollider.github.io/)  
[Designing Sound in SuperCollider](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider)  
[オープンソースの音響プログラミング言語「SuperCollider」の紹介](https://tracpath.com/works/devops/supercollider/)  
[SuperCollider自主練 - 基本編](https://yoppa.org/works/ofbook_study/ofbook_study01.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

