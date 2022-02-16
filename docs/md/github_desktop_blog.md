  
# GitHubでblog(webサーバー)を実現する  
2022/2/16  
初版  

## 概要  
GitHibでblogを実現する方法について紹介する。  
ここでは、すでにGitHubアカウントがある前提で説明する。  
(アカウント作成については、「[GitHubアカウントの作成方法 (2021年版)](https://qiita.com/ayatokura/items/9eabb7ae20752e6dc79d)」などを参照のこと)  
  
ツールとして「GitHub Desktop」を使用するので  
以下のurlからダウンロードしてインストールする：  
```  
windows10の場合：  
以下のurlからインストーラーをダウンロードして実行する。  
https://central.github.com/deployments/desktop/desktop/latest/win32  
  
ubuntuの場合：  
cd  ~/Downloads  
wget https://github.com/shiftkey/desktop/releases/download/release-2.9.6-linux1/GitHubDesktop-linux-2.9.6-linux1.deb  
sudo apt install ./GitHubDesktop-linux-2.9.6-linux1.deb  
```  
  
以降、手順を説明する。  
  
## Create Repository  
まず、web用に新たにrepositoryを作る。  
「GitHub Desktop」を起動する。  
「GitHub Desktop」のウィンドウが表示されるので以下の操作を行なう：  
  
[Current repository]タブで以下を行なう：  
1. [↓]をクリックする  
1. [Add ↓]をクリックする  
1. 「Create new repository」をクリックして  
出現した以下の入力欄に必要な項目を入力する：  
* Name
  作成するrepository名  
* Description  
　作成するrepositoryの説明
  
以下にチェックマークを付ける：  
'Inialize this repository with a README'  

他はデフォルトのままで  
[Create repository]をクリックする。  
\#この時点でlocal(PC上の)repositoryが作成される  
  
出現した[Publish repository]をクリックして  
remote(GitHub上の)repositoryも作成する。  
  
## updateテスト  
~/Documents/GitHub/<新規のrepository名>のREADME.mdを編集する。  

update確認用に以下のテキストを追加する：  
「1st update」  

そうすると    
「GitHub Desktop」の画面に変更差分(編集追加分)が表示される：  
   
左下のペインに  
Summary  
Description  
[Commit to main]  
  
が表示されるので  
必要があればsummary,descriptionを入力して(Summaryは入力必須)  
[Commit to main]をクリックする。  
  
すると、右側の大きいペインに[Push origin]が出現するので  
それをクリックすると、localとremoteのrepositoryが同期する。 

「GitHub Desktop」の画面の [View on GitHub]をクリックして  
GitHubの(remoteの)repositoryの内容を確認できる。  

  
## GitHub設定  
次にweb公開するために設定を変更する。  
  
GitHub(web上)の最上行の最右端の[Setting]で以下を変更する：  
  
1.現状、privateなので、web公開ができるようにpublicにする  
  
Danger Zone  
[Change visiblility]をクリックして  
そのタブのなかで、privateからpublicに変更する。  
  
2.webアクセス用のurlを設定する  
  
GitHub Page  
Sourceのメニューで  
main/docs  
に切り替えて[Save]をクリックする。  

以下が表示される：  
```
 Your site is ready to be published at https://<githubユーザー名>.github.io/<repository名>/  
```

 Theme Chooser  
 [Choose a theme]で  
 好みのテーマを選択する。  
   
 repositoryのdocs配下に  
 index.mdが作成される。  
   
 これでよければ[Commit change]をクリックする。  
   
 この時点でremotoとlocalの内容に差分があるので  
 localのrepositoryをremoteのものと同期するために  
 「GitHub Desktop」で 目的のrepositoryに切り替えて[Fetch origin]をクリックする。  
 localとremoteで差分がある場合は、[Pull origin]が出現するのでクリックする。  
   
## webコンテンツ作成  
あとは、localのrepositoryのdocsにwebコンテンツとしての  
ファイル(.md)を作成して、remoteのrepositoryと同期すれば  
webコンテンツとしてアップデートされる。  
  
このwebコンテンツにアクセスする場合、以下のurlにアクセスする：  
https://<githubユーザー名>.github.io/<repository名>/  

以下、GitHubを使ったblogの実例：    
https://xshigee.github.io/web0/  

  
## 参照情報  
* [GitHubアカウントの作成方法 (2021年版)](https://qiita.com/ayatokura/items/9eabb7ae20752e6dc79d)
* [GitHubのmarkdown仕様 / Basic writing and formatting syntax](https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).  
  
以上  
