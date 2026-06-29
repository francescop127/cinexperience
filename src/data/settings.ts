import { MovieSetting } from '../types';

export const MOVIE_SETTINGS: MovieSetting[] = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk Neon City',
    genre: 'Fantascienza / Cyberpunk',
    description: 'Immergiti tra i grattacieli futuristici, pioggia sottile e neon viola di una megalopoli del 2099.',
    imageUrl: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'NEON DISTRICT',
    promptHint: 'Abito futuristico o giacca in pelle nera lucida, luci neon ciano e magenta riflesse.'
  },
  {
    id: 'space_odyssey',
    title: 'Odissea nello Spazio',
    genre: 'Fantascienza / Space Opera',
    description: 'Il ponte di comando di un incrociatore stellare che osserva un buco nero rotante supermassiccio.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'DEEP SPACE',
    promptHint: 'Tuta spaziale o uniforme da ufficiale di bordo, stelle e nebulose cosmiche sullo sfondo.'
  },
  {
    id: 'fantasy_forest',
    title: 'Regno di Eldoria',
    genre: 'Epic Fantasy',
    description: 'Un bosco fatato eterno con funghi luminescenti, cascate d\'acqua azzurra e rovine di un antico tempio.',
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'FORESTA INCANTATA',
    promptHint: 'Mantello regale o abiti medievali, circondato da polvere magica dorata e foglie scintillanti.'
  },
  {
    id: 'vintage_noir',
    title: 'Milano Noir 1948',
    genre: 'Giallo / Vintage Noir',
    description: 'Un ufficio investigativo fumoso con ombre a veneziana, detective con cappello e fari d\'auto nella nebbia.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'UFFICIO DEL DETECTIVE',
    promptHint: 'Cappotto e cappello fedora stile anni 40, fumo leggero d\'atmosfera, filtro in bianco e nero drammatico.'
  },
  {
    id: 'western_sunset',
    title: 'Canyon del Redentore',
    genre: 'Western / Avventura',
    description: 'Il deserto rosso dell\'Arizona al tramonto con cactus imponenti, polvere dorata e montagne maestose.',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'FRONTiera SELVAGGIA',
    promptHint: 'Cappello da cowboy, bandoliera, atmosfera calda e polverosa color ocra e arancione tramonto.'
  },
  {
    id: 'action_apocalypse',
    title: 'Day After Tomorrow',
    genre: 'Azione / Post-Apocalittico',
    description: 'Scenario urbano catastrofico con cielo tempestoso, elicotteri in sorvolo e nuvole di fumo cinematico.',
    imageUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800&auto=format&fit=crop',
    overlayLabel: 'ZONA DI CONTROLLO',
    promptHint: 'Gilet tattico militare, occhiali scuri, scintille di detriti e fumo di fiamme dorate ai lati.'
  }
];
