function doPost(e) {
  var params = JSON.parse(e.parameter.data);

  var scriptProperties = PropertiesService.getScriptProperties();
  
  var response = ContentService.createTextOutput()
  .setMimeType(ContentService.MimeType.JSON);
  
  //-------------------------Authentication-------------------------
  var auth = new Authorization(params, scriptProperties);  
  if(! auth.authorize())
  {
    var error = {
      'message' : 'Invalid authentication credentials.',
      'status' : 'UNAUTHORIZED'
    };
    response.setContent(JSON.stringify(error));
    return response;
  }
  
  //-------------------------Validation------------------------- 
  var validation = new Validation(params);
  if(! validation.validate())
  {
    var error = {
      'message' : 'One or more fields are invalid.',
      'status'  : 'INVALID_ARGUMENT ',
      'details' : validation.getErrors()
    };
    response.setContent(JSON.stringify(error));
    return response;
  }
  
  //-------------------------Arguments-------------------------
  var validValues = validation.getValues();
  var texts = validValues.texts;
  var sourceLanguage = validValues.sourceLanguage;
  var targetLanguage = validValues.targetLanguage;
  
  var defaultAvancedArgs = {
    contentType: 'text'
  };
  var advancedArgs = typeof(params.advancedArgs) === 'undefined' ? defaultAvancedArgs : params.advancedArgs;
  
  //-------------------------Translation-------------------------
  var translatedTexts = [];
  try
  {
    translatedTexts = texts.map(function(item){
      var text = {};
      text.key = item.key;
      text.text = LanguageApp.translate(item.text, sourceLanguage, targetLanguage, advancedArgs);
      return text;
    });
  }
  catch(e)
  {
    var error = {
      'message' : 'LanguageApp.translate() failed.',
      'status'  : 'ERROR',
      'details' : e
    };
    response.setContent(JSON.stringify(error));
    return response;
  }
  //-------------------------Result-------------------------
  var retContent = {
    'translatedTexts' : translatedTexts,
    'sourceLanguage' : sourceLanguage,
    'targetLanguage' : targetLanguage
  };
  response.setContent(JSON.stringify(retContent));
  return response;
}

var Authorization = function(params, scriptProperties)
{
  this.params = params;
  this.scriptProperties = scriptProperties;
  
  this.authorize = function()
  {
    if(typeof(this.params.credentials) === 'undefined' || typeof(this.params.credentials.secret) === 'undefined')
    {
      return false;
    }
    
    var sentSecret = this.params.credentials.secret.trim();
    
    if(sentSecret === '')
    {
      return false;
    }
    
    if(sentSecret === this.scriptProperties.getProperty('APP_SECRET'))
    {
      return true;
    }
    return false;    
  }
}

var Validation = function(params)
{
  this.keys = ['texts', 'sourceLanguage', 'targetLanguage'];
  this.errorDetails = [];
  this.values = {};
  this.params = params;
  
  this.validate = function()
  {
    if(typeof(this.params.translation) === 'undefined')
    {
      this.errorDetails.push('Request field "translation" is required.');
      return false;
    }
    
    var tlanslationParams = this.params.translation;
    
    for(var i = 0; i < this.keys.length; i++)
    {
      var key = this.keys[i];
      var msg = '';
      if(typeof(tlanslationParams[key]) === 'undefined')
      {
        msg = 'Request field "translation.' + key + '" is required.'
        this.errorDetails.push(msg);
        continue;
      }
      
      var value = tlanslationParams[key];
      
      if(key === 'texts')
      {
        if(Array.isArray(value))
        {
          this.values[key] = value;
        }
        else
        {
          msg = 'Request field "translation.' + key + '" is not an Array.';
          this.errorDetails.push(msg);
        }
        continue;
      }
      
      value = value.trim();
      
      if(value === '')
      {
        msg = 'Request field "translation.' + key + '" is empty.'
        this.errorDetails.push(msg);
        continue;
      }
      
      this.values[key] = value;
    };
    
    return this.errorDetails.length == 0 ? true : false;
  }
  
  this.getValues = function()
  {
    return this.values;
  };
  
  this.getErrors = function()
  {
    return this.errorDetails;
  }
};
