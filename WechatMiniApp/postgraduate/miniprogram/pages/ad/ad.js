Page({
    data: {
      adUrl: '' ,
      className:'',
      xxx:3,
      route:'',
      pnum:''
    },
  
    onLoad() {
      this.getImg(); 
    },
  
    getImg() {
      wx.request({
        url: 'http://182.92.158.95:8020/api/banner/list',
        method: 'GET',
        header: {
          'token': '2bd039d8d5a41405b005a7bee9ca7ec7',
          'content-type': 'application/json'
        },
        success: (res) => {
          console.log('接口返回数据:', res.data);
          
          if (res.data.code === "000000" ) {
            const imageUrl = res.data.data.result[0].file;
            this.setData({
              adUrl: imageUrl
            });
          } else {
            wx.showToast({
              title: '未找到图片',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          // 请求失败
          console.error('获取图片失败:', err);
          wx.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    },

    showPdf(e){
        const p=e.currentTarget.dataset.p;
        const currentP=this.data.pnum;

        if (currentP === p) {
            this.setData({
              pnum: '', 
              className: '',
              route: ''
            });
          } else {
            this.setData({
              pnum: p, 
              className: 'wordBig', 
              route: 'route' 
            });
          }
    },


   
  })
  