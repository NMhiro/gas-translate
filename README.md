# GAS-TRANSLATE
GAS(Google Apps Script)を使用して文章の翻訳を行います。

# installation
- GASのプロジェクトにtranslate.gsの内容を貼り付けて保存します。
  - 設定方法: https://developers.google.com/apps-script/guides/web
- スクリプトのプロパティにて認証用のキーと値を設定します。
  - キー： APP_SECRET
  - 値：任意のシークレットキー

# usage
以下のパラメータをPOSTします。

| フィールド名 | 値 |
----|----
| data | JSON形式の文字列(形式は以下) |

- credentials
  - secret : APP_SECRETと同じ値
- translations
  - texts ： keyとtextのプロパティを持つオブジェクトの配列。
  - sourceLanguage : 翻訳もととなる言語をあらわす文字列(from)
  - targetLanguage : 翻訳さきとなる言語をあらわす文字列(to)

使用可能な言語について: https://cloud.google.com/translate/docs/languages

# example
    var data =
    {
        "credentials" : {"secret" : "your secret key"},
        "translation" :
        {
            "texts": [{"key":"1", "text":"I have a pen."}, {"key":"2","text":"I have an apple."}],
            "sourceLanguage":"en",
            "targetLanguage":"ja"
        }
    };
    
    //以下の形式で返す
    {
        "translatedTexts" :
        {
          "1" : "私はペンを持っている。",
          "2" : "私はリンゴを持っている。"
        },
        "sourceLanguage" : "en",
        "targetLanguage" : "ja"
    }
