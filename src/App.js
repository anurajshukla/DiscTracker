import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import logo from './img/logo.png';

const CLIENT_ID="358bc2a999a44de5a9a9da31578fd911"
const CLIENT_SECRET="b8554cb38f6c483da703420f5e52c18f"


function App() {
  const [searchInput, setSearchInpt] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  // new card comp
  const [isShown, setIsShown] = useState(false);
  const handleClick = event => { setIsShown(current => !current); };


  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput); 

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(respone => respone.json())
      .then(data => { return data.artists.items[0].id })
    
    console.log("Artisit ID: " + artistID) 

    var returnedalbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album', searchParameters )
      .then(respone => respone.json())
      .then(data => { 
        console.log(data)
        setAlbums(data.items)
      });
    // display those albums to the user
  }
  console.log(albums)
  return (
    <div className="App">
      <div className='navbar navbar-expand-lg navbar-black bg-black static-top'>
        <img className='navbar-brand .d-flex' src={logo} alt="logo" height="56" /> 
      </div>
      <Container className='a'>
        <InputGroup className='mb-4' size="lg">
          <FormControl 
            placeholder='Search for Artist'
            type='input'
            onKeyPress={event => {
              if(event.key == 'Enter') {
                search();
              }
            }}
            onChange={event => setSearchInpt(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 cols row row-cols-4'>
          {albums.map( (album, i) => {
            return (
              <Card className='b'>
              <Card.Img src={album.images[0].url} onClick={()=> window.open(album.external_urls.spotify, "_blank")} />
              <Card.Body className='d-none d-lg-block' onClick={handleClick}>
              {isShown ? <>
                <Card.Text> Released: {album.release_date}</Card.Text> 
                <Card.Text> Total Tracks: {album.total_tracks } </Card.Text> </>
              : null }
              <Card.Title> {album.name} </Card.Title>
              
              </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;