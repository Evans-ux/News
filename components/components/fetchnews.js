/*apikey = `0791030da576c2ae30c502ad74cd0c39`;
category = `general`
url = `https://gnews.io/api/v4/top-headline?category=${category}&lang=en&country=us&max=10&apikey=${apikey}`

export default Fetchthenews = () => {fetch(url)
.then(function (response){
    return response.json()
})
.then(function (data){
    articles = data.articles;
    for (let i = 0; i < articles.length; i++) {
          return (
             alert("Title:" + artcles[i][`title`])
             
           
          )
          
        
    }
})}*/