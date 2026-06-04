import { useApp } from '@/context/AppContext';
import CharacterAvatar from '@/components/avatar/CharacterAvatar';

export default function Character() {
  const { state } = useApp();
  return (
    <div>
      <h1>🧑 Character</h1>
      <p>Meet {state.character.name}, your cozy companion.</p>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <CharacterAvatar character={state.character} size="xl" />
      </div>
    </div>
  );
}
