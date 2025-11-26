// Sample product data for left (Shopee-like) and right (TikTok-like)
const shopeeProducts = [
  {id:1, title:'Áo thun nam cotton', price:'₫129.000', img:'https://via.placeholder.com/160x160?text=Shp+1', link:'https://shopee.vn', affiliate:''},
  {id:2, title:'Tai nghe bluetooth', price:'₫299.000', img:'https://via.placeholder.com/160x160?text=Shp+2', link:'https://shopee.vn', affiliate:''},
  {id:3, title:'Đồng hồ thể thao', price:'₫499.000', img:'https://via.placeholder.com/160x160?text=Shp+3', link:'https://shopee.vn', affiliate:''}
]

const tiktokProducts = [
  {id:1, title:'Đầm nữ thời trang', price:'₫199.000', img:'https://via.placeholder.com/160x160?text=Tik+1', link:'https://www.tiktok.com', affiliate:''},
  {id:2, title:'Đèn led trang trí', price:'₫79.000', img:'https://via.placeholder.com/160x160?text=Tik+2', link:'https://www.tiktok.com', affiliate:''},
  {id:3, title:'Sữa rửa mặt', price:'₫89.000', img:'https://via.placeholder.com/160x160?text=Tik+3', link:'https://www.tiktok.com', affiliate:''}
]

function el(tag, cls, inner){
  const e = document.createElement(tag)
  if(cls) e.className = cls
  if(inner !== undefined) e.innerHTML = inner
  return e
}

function renderProduct(product){
  const card = el('div','card')
  const img = document.createElement('img')
  img.src = product.img
  img.alt = product.title

  const meta = el('div','meta')
  // title as a link to the product page (non-affiliate)
  const title = document.createElement('div')
  title.className = 'title'
  const titleLink = document.createElement('a')
  titleLink.href = product.link || '#'
  titleLink.target = '_blank'
  titleLink.rel = 'noopener noreferrer'
  titleLink.textContent = product.title
  title.appendChild(titleLink)

  const price = el('div','price',product.price)
  meta.appendChild(title)
  meta.appendChild(price)

  // actions (affiliate buy button)
  const actions = el('div','actions')
  const buy = document.createElement('a')
  buy.className = 'buy'
  buy.href = product.affiliate || product.link || '#'
  buy.target = '_blank'
  buy.rel = 'noopener noreferrer sponsored'
  buy.textContent = 'Mua ngay'
  actions.appendChild(buy)

  card.appendChild(img)
  card.appendChild(meta)
  card.appendChild(actions)

  return card
}

function mountList(containerId, items){
  const container = document.getElementById(containerId)
  container.innerHTML = ''
  items.forEach(it => container.appendChild(renderProduct(it)))

}

// Decompress a string produced by LZ-String.compressToEncodedURIComponent
function decompressFromUrl(str){
  if(!str) return ''
  try{
    if(window.LZString && LZString.decompressFromEncodedURIComponent){
      const out = LZString.decompressFromEncodedURIComponent(str)
      return out || ''
    }
    // fallback: try decodeURIComponent
    return decodeURIComponent(str)
  }catch(e){
    return ''
  }
}

function getParam(name){
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

window.addEventListener('DOMContentLoaded', ()=>{
  mountList('shopeeList', shopeeProducts)
  mountList('tiktokList', tiktokProducts)
  
  // decoded URL (supports LZ-String compressed strings)
  const param = getParam('u')
  const url = decompressFromUrl(param)
  const m3u8Url = url || null

  const videoEl = document.getElementById('mainVideo')
  if(videoEl && m3u8Url){
    // Mute video before attempting autoplay to satisfy browser policies
    try{ videoEl.muted = true }catch(e){}
    // If hls.js available and supported, use it (for Chrome/Firefox/Edge)
    if(window.Hls && window.Hls.isSupported && window.Hls.isSupported()){
      const hls = new window.Hls()
      hls.loadSource(m3u8Url)
      hls.attachMedia(videoEl)
      hls.on(window.Hls.Events.MANIFEST_PARSED, ()=>{
        // try to autoplay; browsers may block autoplay without user gesture
        videoEl.play().catch(()=>{})
      })
    } else if(videoEl.canPlayType && videoEl.canPlayType('application/vnd.apple.mpegurl')){
      // Native HLS (Safari)
      videoEl.src = m3u8Url
      videoEl.addEventListener('loadedmetadata', ()=>{
        videoEl.play().catch(()=>{})
      })
    } else {
      console.warn('HLS/m3u8 not supported in this browser.')
    }
  }
})
