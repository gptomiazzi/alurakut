import { ProfileRelationsBoxWrapper } from "../ProfileRelations";

function ProfileRelationBox(props) {
    return (
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            {props.title} ({props.items.length})
        </h2>
  
        <ul>
            {props.items.map((itemAtual, indice) => {
              return (
                <li key={itemAtual}>
                  <a href={`https://github.com/${itemAtual}.png`}>
                    <img src={itemAtual.image}/>
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
        </ul>
      </ProfileRelationsBoxWrapper>
    );
  }

export default ProfileRelationBox;