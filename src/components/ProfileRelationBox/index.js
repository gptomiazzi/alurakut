import { ProfileRelationsBoxWrapper } from "../ProfileRelations";

function ProfileRelationBox(props) {
    return (
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            {props.title} ({props.items.length})
        </h2>
  
        <ul>
          {props.items.map((itemAtual, i = 0) => {
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
          })}
        </ul>
      </ProfileRelationsBoxWrapper>
    );
  }

export default ProfileRelationBox;