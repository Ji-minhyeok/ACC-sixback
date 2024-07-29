document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('testform');
  form.addEventListener('submit', test);
});

async function test(event) {
  event.preventDefault();

  // 테스트를 위해 text 3개, image 3개인 템플릿으로 고정
  const text1 = document.querySelector('#text1');
  const text2 = document.querySelector('#text2');
  const text3 = document.querySelector('#text3');
  const image1 = document.querySelector('#image1');
  const image2 = document.querySelector('#image2');
  const image3 = document.querySelector('#image3');
  const email = document.querySelector('#email');
  const templateKey = document.querySelector('#templateKey');

  for (let i = 1; i < 4; i++) {
    const image = document.querySelector('#image' + i);
    const apiGateway1RequestBody = JSON.stringify({
      // TODO: filename 대신 난수로 암호화한 값을 넘겨줄 것
      filename: image.files[0].name,
    });

    await getUrl(apiGateway1RequestBody, image.files[0]);
  }

  // key = prefix + filename (key는 람다 환경 변수에 저장)
  var apiGateway2RequestBody = JSON.stringify({
    images: {
      // TODO: filename 대신 getUrl 함수에서 받은 s3 url 넣기
      image1: image1.files[0].name,
      image2: image2.files[0].name,
      image3: image3.files[0].name,
    },
    texts: { text1: text1.value, text2: text2.value, text3: text3.value },
    email: email.name,
    // TODO: dynamodb에서 template 받아서 key도 body에 넣기. 시간 없으면 template을 알고 있다고 가정하고 고정된 template 사용.
    // templateKey: templateKey,
  });

  regularUser(apiGateway2RequestBody);
}

// presigned url 받아오는 함수
async function getUrl(requestBody, image) {
  url =
    'https://513l3hg7ah.execute-api.ap-northeast-2.amazonaws.com/dev_email/api/email';

  fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: requestBody,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.url) {
        console.log(data.url);
        const res = putImage(data.url, image);
      } else {
        alert('Error');
      }
    })
    .catch((error) => {
      alert(error);
    });
}

// S3에 이미지 넣는 함수
async function putImage(url, data) {
  var formdata = new FormData();
  formdata.append('image', data);
  await fetch(url, {
    method: 'put',
    body: formdata,
  });
}

// API Gateway2를 호출하는 함수
function regularUser(requestBody) {
  // alert(requestBody);
}
