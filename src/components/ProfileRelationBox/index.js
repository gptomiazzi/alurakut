import { ProfileRelationsBoxWrapper } from "../ProfileRelations";

function ProfileRelationBox(props) {
    return (
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            {props.title} 
            ({ props.items[0]
              ? props.items.length
              : '0'
            })
        </h2>
  
        <ul>
          { props.items[0]
            ? props.items.map((itemAtual, i = 0) => {
              if (i < 6) {
                i++
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.html_url}>
                      <img src={itemAtual.avatar_url}/>
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              }
            })
            : <li></li>
          }
          {/* {props.items.map((itemAtual, i = 0) => {
            if (i < 6) {
              i++
              return (
                <li key={itemAtual.id}>
                  <a href={itemAtual.html_url}>
                    <img src={itemAtual.avatar_url}/>
                    <span>{itemAtual.login}</span>
                  </a>
                </li>
              )
            }
          })} */}
        </ul>
      </ProfileRelationsBoxWrapper>
    );
  }

export default ProfileRelationBox;