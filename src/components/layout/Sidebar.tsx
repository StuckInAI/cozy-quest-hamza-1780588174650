import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Layers, Repeat, Map, ShoppingBag, Trophy, User, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/quests', label: 'Quests', icon: Sparkles },
  { to: '/projects', label: 'Projects', icon: Layers },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/world', label: 'World', icon: Map },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/achievements', label: 'Badges', icon: Trophy },
  { to: '/character', label: 'Character', icon: User },
  { to: '/analytics', label: 'Garden Stats', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logo}>🌿</span>
        <span className={styles.brandText}>Cozy Quest</span>
      </div>
      <nav className={styles.nav}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx(styles.link, isActive && styles.active)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <p className={styles.tip}>“Soft progress is still progress.”</p>
      </div>
    </aside>
  );
}
