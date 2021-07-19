import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import ProfileRelationBox from '../src/components/ProfileRelationBox';
import ProfileSidebar from '../src/components/ProfileSidebar';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


export default function Home(props) {
  const githubUser = props.githubUser;
  
  const [ comunidades, setComunidades ] = React.useState([]);

  const [ following, setFollowing ] = React.useState([]);

  const [ followers, setFollowers ] = React.useState([]);

  React.useEffect(() => {
    const ENDPOINT = `https://api.github.com/users/${githubUser}`;
    const URL_CONFIG = '?per_page=6&page=1&order=DESC';

    const URL_FOLLOWING = `${ENDPOINT}/following${URL_CONFIG}`;
    const URL_FOLLOWERS = `${ENDPOINT}/followers${URL_CONFIG}`;

    // Seguidores do GitHub
    fetch(URL_FOLLOWERS)
    .then(async (response) => {
      setFollowers(await response.json())
    })
    
    // Seguindo do GitHub
    fetch(URL_FOLLOWING)
    .then(async (response) => {
      setFollowing(await response.json())
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'd55d3c61d740ca4adebffa1039f127',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          communityLink
          imageUrl
          id
          creatorSlug
        }
      }` })
    })
    .then( async (response) => {
      const responseComunities = await response.json();
      setComunidades(responseComunities.data.allCommunities);
    })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={ githubUser }/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={ githubUser }/>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCreateCommunity(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              
              console.log('Campo:', dadosDoForm.get('title'));
              console.log('Imagem:', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                communityLink: dadosDoForm.get('link'),
                creatorSlug: githubUser,
              };

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                const comunidade = dados.registroCriado;

                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  autoComplete="off"
                  />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div>
                <input 
                  placeholder="Qual o link da sua comunidade?" 
                  name="link" 
                  aria-label="Qual o link da sua comunidade?"
                  type="text"
                  autoComplete="off"
                  />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          
          <ProfileRelationBox title="Seguidores " items={followers}/>
          
          <ProfileRelationBox title="Seguindo " items={following}/>
          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

          <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.communityLink}>
                      <img src={itemAtual.imageUrl}/>
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>   
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  
  //TROCAR P/ LOCALHOST QUANDO FOR ALTERAR
  const { isAuthenticated } = await fetch('https://alurakut-eight-gamma.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((res) => res.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode((token))
  return {
    props: {
      githubUser
    },
  }
}