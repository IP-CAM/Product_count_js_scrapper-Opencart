var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js";
$("head").append(s);

var s = document.createElement("link");
s.type = "text/css";
s.rel = "stylesheet";
s.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css";
$("head").append(s);

setTimeout(function () {
  let atags = []
  let total_count = 0
  let total_comments_count = 0
  let datas = []
  var pages = 20
  var pagesToGet = []

  for(let i = 1; i <= pages; i++) {
    pagesToGet.push(i)
  }

  async function getURLS(i) {
    await $.get('https://www.opencart.com/index.php?route=marketplace/extension&filter_member=codeeshop&page=' + i, function(html, status){
        $(html).find('img').remove()        
        //atags.push($(html).find('.extension-preview a'))
        // Removing Popular Extensions
        let allChilds = $(html).find('#extension-list')[0].childNodes
        let newTags = []
        for (var i = allChilds.length - 1; i >= 0; i--) {
          if(allChilds[i].localName == 'hr') break;
          if($(allChilds[i]).find('.extension-preview a').length) {
            let childs = $(allChilds[i]).find('.extension-preview a')
            for (var k = childs.length - 1; k >= 0; k--) {
              newTags.push(childs[k])
            }
          }
        }
        atags.push(newTags)
    })
  }

  async function myfunc() {
    let data = []
    for(y=0; y< atags.length; y++) {
      for(i=0; i< atags[y].length; i++) {
        let url = atags[y][i].getAttribute('href')
        // console.log(url)
        await $.get(url, function(html, status){          
           let tdata = {
              'sale_count': parseInt($(html).find('#sales strong').text()),
              'name': $(html).find('.container h3:first').text(),
      	      'comment': parseInt($(html).find('#comment strong').text()),
      	      'price': $(html).find('#price .text-right').text(),   
              // 'url': url,
           }

           datas.push(tdata)
           toastr["success"](tdata.sale_count + ' : '+ tdata.name)
           total_count += parseInt(tdata.sale_count)
           total_comments_count += parseInt(tdata.comment)
        })
      }
    }
  }

  const mapLoop = async _ => {
    console.log('Start')
    const promises = pagesToGet.map(async page => {
      const numFruit = await getURLS(page)
      return numFruit
    })

    const numFruits = await Promise.all(promises)
    await myfunc()

    datas.sort(GetSortOrder("sale_count"));
    console.table(datas)
    //copy(datas)
    console.log({total_count, total_count, total_comments_count: total_comments_count})
    toastr["success"]('total_count : ' + total_count)
    console.log('End')
  }

  function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
  }
  mapLoop()  
}, 2000)
