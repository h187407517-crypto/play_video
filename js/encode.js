// Use LZ-String to compress the URL and produce a URL-safe encoded string.
// This significantly reduces the encoded length compared to raw Base64 for long URLs.
function compressForUrl(str){
  try{
    return LZString.compressToEncodedURIComponent(str)
  }catch(e){
    // fallback to basic encodeURIComponent if LZString not available
    return encodeURIComponent(str)
  }
}

function init(){
  const raw = document.getElementById('rawUrl')
  const enc = document.getElementById('encoded')
  const link = document.getElementById('viewerLink')
  const encodeBtn = document.getElementById('encodeBtn')
  const clearBtn = document.getElementById('clearBtn')
  const copyBtn = document.getElementById('copyBtn')

  encodeBtn.addEventListener('click', ()=>{
    const v = (raw.value || '').trim()
    if(!v){
      alert('Nhập URL m3u8 trước.')
      return
    }
    // compress the URL into a shorter, URL-safe string
    const code = compressForUrl(v)
    enc.value = code
    // viewer uses param name `u`
    link.value = window.location.href.replace(/[^/]*$/, '') + 'index.html?u=' + code
  })

  clearBtn.addEventListener('click', ()=>{
    raw.value = ''
    enc.value = ''
    link.value = ''
  })

  copyBtn.addEventListener('click', ()=>{
    if(!enc.value && !link.value){
      alert('Chưa có gì để copy')
      return
    }
    const toCopy = link.value || enc.value
    navigator.clipboard?.writeText(toCopy).then(()=>{
      alert('Đã copy')
    }).catch(()=>{
      prompt('Copy thủ công:', toCopy)
    })
  })
}

window.addEventListener('DOMContentLoaded', init)
