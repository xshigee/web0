    
# linuxでbrew/clojureをインストールする  

2023/4/13        
初版    
  
## 概要 
linuxでbrew経由でclojure/leinをインストールする手順について記述する。  

## brewのインストール
以下を実行する：  
```bash

sudo apt install build-essential procps curl file git
/usr/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/XXXX/.profile
# XXXXを実際のユーザー名にする
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
sudo apt install build-essential
brew install gcc

#バージョンを確認して、pathが通っている確認。
brew --version
Homebrew 4.0.12

```
参考：[ubuntuにHomebrewをインストール](https://zenn.dev/akgcog/articles/2e63b33ee3001a)  

## clojure/leiningenのインストール
以下を実行する：  

```bash
brew install clojure/tools/clojure

# バージョンの確認
clj --version
Clojure CLI version 1.11.1.1273

brew insall leiningen

```
参考：[Install Clojure](https://clojure.org/guides/install_clojure)  

## python3.10のインストール
brewをインストールすると   
pythonが最新版になるようなので   
それが不都合になる場合、  
以下を実行して別名でpython3.10をインストールする： 
[UbuntuにPython 3.10をインストールする方法](https://codechacha.com/ja/python-install-python-3-10/)  
\# この場合、コマンド名を別名にするので既存のものをアンインストールする必要はない。  
以下を実行する：  
```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.10
# インストールが完了したら、
# 以下のようにインストールされていることを確認する。
python3.10 --version  
3.10.3
```
## OpenJDKのインストール
上のインストールで自動的にOpenJDKがインストールされているような気がするが、  
インストールされてなければ以下を実行する:  

「[How to Install OpenJDK on Ubuntu 22.04](https://www.linode.com/docs/guides/how-to-install-openjdk-ubuntu-22-04/)」を参照するがubuntu22.10でも有効のようなので、そのまま実行する。  

```bash

sudo apt update && sudo apt upgrade -y

sudo apt install openjdk-17-jdk
#sudo apt-get install openjdk-17-jre 

# バージョン確認
javac -version
javac 17.0.6

gedit ~/.bashrc

以下を追加する：  
---------------------
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export PATH=$PATH:$JAVA_HOME/bin
---------------------

# 現在の環境に反映させる
source ~/.bashrc

# パスの確認
echo $JAVA_HOME
echo $PATH

```

OpenJDKの動作確認：　　

以下のファイルを作成する。   
HelloWorld.java
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World from Java!");
    }
}
```

ビルド：  
```
javac HelloWorld.java
```

実行：
```
java HelloWorld

出力：
Hello World from Java!

```


以上

## 参考情報 
SuperCollider関連：   
[SuperCollider](https://supercollider.github.io/)  
[Designing Sound in SuperCollider](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider)  
[オープンソースの音響プログラミング言語「SuperCollider」の紹介](https://tracpath.com/works/devops/supercollider/)  
[SuperCollider自主練 - 基本編](https://yoppa.org/works/ofbook_study/ofbook_study01.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

