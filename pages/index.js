import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import ProfileRelationBox from '../src/components/ProfileRelationBox';
import ProfileSidebar from '../src/components/ProfileSidebar';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

export default function Home() {
  const githubUser = 'gptomiazzi';
  
  const [ comunidades, setComunidades ] = React.useState([]);

  const [seguindo, setSeguindo] = React.useState([]);

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    // Seguidores do GitHub
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then( async (response) => {
      setSeguidores(await response.json());
    })
    
    // Seguindo do GitHub
    fetch(`https://api.github.com/users/${githubUser}/following`)
    .then( async (response) => {
      setSeguindo(await response.json());
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
              {/*CRIAR CAMPO P/ INFORMAR O USUÁRIO*/}
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
          
          <ProfileRelationBox title="Seguidores" items={seguidores}/>
          
          <ProfileRelationBox title="Seguindo" items={seguindo}/>
          
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
