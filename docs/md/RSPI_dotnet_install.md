
2023/9/25  
初版  

# RaspberryPiのdotnetのインストール

## 概要
RaspberryPiでのdotnetのインストールを纏めた。
OSが32bitか64bitでインストールするバイナリが異なるが
64bitを中心に説明する。

## インストール
```

ARM 32bitの場合:
wget https://download.visualstudio.microsoft.com/download/pr/29525dd0-1dd5-4d8d-9771-5ebad1143c75/b23ca78cef5e8058222584e09b5fe3de/dotnet-sdk-7.0.401-linux-arm.tar.gz

ARM 64bitの場合:
wget https://download.visualstudio.microsoft.com/download/pr/799b3459-f1de-4c88-ae38-fd1aa76c2d73/db275a0fe9776b55cf0f81cb0788b6a9/dotnet-sdk-7.0.401-linux-arm64.tar.gz

以下、64bitを前提に記述してある：
mkdir -p $HOME/.dotnet && tar zxf dotnet-sdk-7.0.401-linux-arm64.tar.gz -C $HOME/.dotnet

echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc
source ~/.bashrc

#バージョン確認
dotnet --version
7.0.401

```


## テスト実行
```
mkdir testApp
cd testApp/
dotnet new console
dotnet run
出力：
Hello, World!

ビルド：
dotnet build


```


## 参照
[.NET 7.0 のダウンロード](https://dotnet.microsoft.com/ja-jp/download/dotnet/7.0)  

以上

[Go to Toplevel](https://xshigee.github.io/web0/)  

