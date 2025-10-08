import profile from '../assets/profile.png';

function Header() {
  return (
    
 <div className="Docente">
            <header>
                <div className='profile_info'>
                    <h3>FULLNAME</h3>
                    <img src={profile} className='user_img' />
                </div>
            </header>
            </div>
    )
}

export default Header;