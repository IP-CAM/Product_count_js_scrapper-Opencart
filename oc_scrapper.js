let atags = []
let total_count = 0  
let datas = []
const pagesToGet = [1,2,3,4,5,6,7]
// const pagesToGet = [1,2]

async function getURLS(i) {
  await $.get('https://www.opencart.com/index.php?route=marketplace/extension&filter_member=iSense&page=' + i, function(html, status){
     atags.push($(html).find('.extension-preview a'))
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
	          'sale_count': $(html).find('#sales strong').text(),
	          'name': $(html).find('.container h3').text(),
	       }

	       datas.push(tdata)
	       total_count += parseInt(tdata.sale_count)
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

  console.table(datas)
  console.log('total_count : ', total_count)
  console.log('End')
}

mapLoop()
