# GAS-TRANSLATE
GAS(Google Apps Script)を使用して文章の翻訳を行います。

# installation
GASのプロジェクトを作成しtranslate.gsの内容を貼り付けて保存します。
スクリプトのプロパティにて認証用のキーと値を設定します。

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

## example
    var data =
    {
        "credentials" : {"secret" : "your secret key},
        "translation" :
        {
            "texts": [{"key":"1", "text":"I have a pen."}, {"key":"2","text":"I have an apple."}],
            "sourceLanguage":"en",
            "targetLanguage":"ja"
        }
    };
