    
# dotnetでC#を動かす   

2022/6/26     
初版    
  
## 概要
dotnet環境でC#を動かす。  
dotnet環境の特徴として、windows,linuxなどのマルチプラットフォームで動作するので、
ここでは、winodews,linux(ubuntu)でのインストールとビルド実行について説明する。  
実行サンプルとして、OSCとOpenXmlを利用したものを紹介する。

## インストール
以下の手順でdotnet環境をインストールする：

* Windows10の場合
以下のurlからインストーラーをダウンロードして実行する。

https://dotnet.microsoft.com/ja-jp/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer


+ linux(ubuntu)の場合

[Ubuntu に .NET SDK または .NET ランタイムをインストールする](https://docs.microsoft.com/ja-jp/dotnet/core/install/linux-ubuntu)  
上のリンクにある説明どおり以下を実行する：

```bash

#「20.04」は、実際に使用しているubuntuのバージョン番号を代入する。

wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get update
sudo apt-get install -y dotnet-sdk-6.0
sudo apt-get install -y aspnetcore-runtime-6.0

```

## 1.プロジェクト作成
インストールが終わったので以下の手順でプロジェクトを作成する：

```bash

# dotnetのバージョンを確認する
dotnet --version
6.0.301

# プロジェクトを作成する(TestOSCはプロジェクト名で任意)
dotnet new console -o TestOSC

# プロジェクトのディレクトリに入る
cd TestOSC

# 実行の確認
dotnet run
# 雛形のプログラムが実行される
Hello, World!

````
この時点で、プログラムの雛形のProgram.csとプロジェクトファイル.csprojが作成される。


## 2.プログラム作成
雛形のプログラムの内容を実際に使用するプログラムに変更する。  
ここではOSC受信のプログラムを使用する：  

本プログラムは以下のzipをダウンロードして利用する：  
https://beta-notes.way-nifty.com/blog/files/PocketBeagleCS.zip  

Program.cs  
```cs

using System;
using System.Net;
using System.Threading;
using Rug.Osc;

class Program
{
    static OscReceiver receiver;
    static Thread thread;

    static void Main(string[] args)
    {
        // This is the port we are going to listen on
        //int port = 12345;
        int port = 12000;

        // Create the receiver
        receiver = new OscReceiver(port);

        // Create a thread to do the listening
        thread = new Thread(new ThreadStart(ListenLoop));

        // Connect the receiver
        receiver.Connect();

        // Start the listen thread
        thread.Start();

        // wait for a key press to exit
        Console.WriteLine("Press any key to exit");
        Console.ReadKey(true);

        // close the Reciver
        receiver.Close();

        // Wait for the listen thread to exit
        thread.Join();
    }

    static void ListenLoop()
    {
        try
        {
            while (receiver.State != OscSocketState.Closed)
            {
                // if we are in a state to recieve
                if (receiver.State == OscSocketState.Connected)
                {
                    // get the next message
                    // this will block until one arrives or the socket is closed
                    OscPacket packet = receiver.Receive();

                    // Write the packet to the console
                    Console.WriteLine(packet.ToString());

                    // DO SOMETHING HERE!
                }
            }
        }
        catch (Exception ex)
        {
            // if the socket was connected when this happens
            // then tell the user
            if (receiver.State == OscSocketState.Connected)
            {
                Console.WriteLine("Exception in listen loop");
                Console.WriteLine(ex.Message);
            }
        }
    }
}

```
## 3.必要なパッケージの追加
上のプログラムで必要なパッケージを追加する。


```bash

dotnet add package Rug.OSC -s https://www.nuget.org/api/v2

```

## 4.実行ビルド

```bash

# 実行
dotnet run
# 警告などが出るが正常に実行される

# 実行せずにビルドする
dotnet build
   
# 以下に実行ファイル(.exe)が作成される
# linux(ubuntu)の場合、TestOSC(.exe無し)になる

ls bin\Debug\net6.0

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        2014/01/05      6:45          74240 Rug.Osc.dll
-a----        2022/06/25     12:16            963 TestOSC.deps.json
-a----        2022/06/25     12:16           5632 TestOSC.dll
-a----        2022/06/25     12:16         148992 TestOSC.exe
-a----        2022/06/25     12:16          10612 TestOSC.pdb
-a----        2022/06/25     12:16            147 TestOSC.runtimeconfig.json

```  

OSC送信は、iPhoneアプリのTouchOSCを使用してPCへOSCメッセージを送ると以下が出力される。   

```
TouchOSCの設定として以下を設定する：
Host(IP): PCのIPアドレス
Port(outgoing): 12000

https://apps.apple.com/app/touchosc/id1569996730
TouchOSC
```

実行出力例： 
TouchOSCのフィーダーやボタンを操作すると以下のような出力が出る：
```
/1/toggle1, 0f
/1/toggle1, 1f
/1/toggle2, 0f
/1/toggle2, 1f
/1/toggle3, 0f
/1/toggle3, 1f
/1/toggle4, 0f
/1/toggle4, 1f
/1/fader5, 0.11524164f
/1/fader5, 0.13754646f
/1/fader5, 0.15427509f
/1/fader1, 0.37974685f
/1/fader1, 0.37763715f
/1/fader1, 0.4156118f
/1/fader1, 0.45991564f
/1/fader1, 0.4957806f
/1/fader3, 0.664557f
/1/fader3, 0.6476793f
/1/fader2, 0.7194093f
/1/fader2, 0.70675105f
/1/fader4, 0.4113924f
/1/fader4, 0.42405063f
/1/fader4, 0.43248945f
/1/fader3, 0.6118144f
/1/fader3, 0.5274261f
/1/fader5, 0.18215613f


```

## 別のサンプル(OpenXml)
別のサンプルとしてOpnXmlのパッケージを利用したサンプルを実行してみる。  

以下にあるサンプルを利用する：  
[[方法] ワープロ ドキュメントに表を追加する (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/how-to-add-tables-to-word-processing-documents)  
参照：[Office Open XML](https://ja.wikipedia.org/wiki/Office_Open_XML)  


以下を実行する：
```   

dotnet new console -o OpenXmlTest

cd OpenXmlTest
# Program.csを編集してサンプルソースにする
code Program.cs

# 必要なパッケージを追加する
dotnet add package DocumentFormat.OpenXml -s https://www.nuget.org/api/v2

# AddTable.docxを作成する(enmtyで良い)
# MS-WORDがない場合、LibreOffice_Writerで
# 新規文書を作成して、docxで保存する

dotnet run
# 警告などが出るが正常に実行される

# 実行するとAddTable.docxに表が追加される。
                                          

```
        
Prgram.cs
```

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace console
{
  public class Program
  {
//<<<<<<<<<<<<<

// Take the data from a two-dimensional array and build a table at the 
    // end of the supplied document.
    public static void AddTable(string fileName, string[,] data)
    {
        using (var document = WordprocessingDocument.Open(fileName, true))
        {

            var doc = document.MainDocumentPart.Document;

            Table table = new Table();

            TableProperties props = new TableProperties(
                new TableBorders(
                new TopBorder
                {
                    Val = new EnumValue<BorderValues>(BorderValues.Single),
                    Size = 12
                },
                new BottomBorder
                {
                  Val = new EnumValue<BorderValues>(BorderValues.Single),
                  Size = 12
                },
                new LeftBorder
                {
                  Val = new EnumValue<BorderValues>(BorderValues.Single),
                  Size = 12
                },
                new RightBorder
                {
                  Val = new EnumValue<BorderValues>(BorderValues.Single),
                  Size = 12
                },
                new InsideHorizontalBorder
                {
                  Val = new EnumValue<BorderValues>(BorderValues.Single),
                  Size = 12
                },
                new InsideVerticalBorder
                {
                  Val = new EnumValue<BorderValues>(BorderValues.Single),
                  Size = 12
            }));

            table.AppendChild<TableProperties>(props);

            for (var i = 0; i <= data.GetUpperBound(0); i++)
            {
                var tr = new TableRow();
                for (var j = 0; j <= data.GetUpperBound(1); j++)
                {
                    var tc = new TableCell();
                    tc.Append(new Paragraph(new Run(new Text(data[i, j]))));
                    
                    // Assume you want columns that are automatically sized.
                    tc.Append(new TableCellProperties(
                        new TableCellWidth { Type = TableWidthUnitValues.Auto }));
                    
                    tr.Append(tc);
                }
                table.Append(tr);
            }
            doc.Body.Append(table);
            doc.Save();
        }
    }

static void Main(string[] args)
{
//const string fileName = @"C:\Users\Public\Documents\AddTable.docx";
const string fileName = @"AddTable.docx";
    AddTable(fileName, new string[,] 
        { { "Texas", "TX" }, 
        { "California", "CA" }, 
        { "New York", "NY" }, 
        { "Massachusetts", "MA" } }
        );
}

//>>>>>>>>>>>>>
  }
}
```         
## 参考情報

[コマンドラインでC#プログラミング](https://qiita.com/shuhey/items/b4211f196259156df8f4)  

[PocketBeagleでのC#(mono)インストールメモ](https://beta-notes.way-nifty.com/blog/2018/07/pocketbeaglecmo.html)  

[スプレッドシート (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/spreadsheets)  
[ワープロ (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/word-processing)  
[プレゼンテーション (Open XML SDK)](https://docs.microsoft.com/ja-jp/office/open-xml/presentations)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

