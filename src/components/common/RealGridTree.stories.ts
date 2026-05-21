import type { Meta, StoryObj } from '@storybook/vue3'
import RealTreeGrid from './RealGridTree.vue'

const meta: Meta<typeof RealTreeGrid> = {
  title: 'Common/RealTreeGrid',
  component: RealTreeGrid,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'text' },
    editable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof RealTreeGrid>

const columns = [
  { fieldName: 'name', name: 'name', header: { text: '앨범 / 곡명' }, width: 200 },
  { fieldName: 'artist', name: 'artist', header: { text: '아티스트' }, width: 130 },
  { fieldName: 'year', name: 'year', header: { text: '발매연도' }, width: 80 },
  { fieldName: 'label', name: 'label', header: { text: '레이블' }, width: 110 },
  { fieldName: 'genre', name: 'genre', header: { text: '장르' }, width: 100 },
  { fieldName: 'plays', name: 'plays', header: { text: '재생수' }, width: 90 },
  { fieldName: 'featuring', name: 'featuring', header: { text: '피처링' }, width: 120 },
  { fieldName: 'duration', name: 'duration', header: { text: '러닝타임' }, width: 80 },
]

const columnLayout = [
  {
    name: 'grp_info',
    direction: 'horizontal' as const,
    hideChildHeaders: false,
    header: {
      template:
        "<span style='display:block'>${top}</span><span style='color:#2a99be;font-size:11px'>${bottom}</span>",
      values: { top: '기본 정보', bottom: 'Basic Info' },
    },
    items: ['name', 'artist', 'year'],
  },
  {
    name: 'grp_release',
    direction: 'horizontal' as const,
    hideChildHeaders: false,
    header: {
      template:
        "<span style='display:block'>${top}</span><span style='color:#2a99be;font-size:11px'>${bottom}</span>",
      values: { top: '발매 정보', bottom: 'Release Info' },
    },
    items: ['label', 'genre'],
  },
  {
    name: 'grp_stats',
    direction: 'horizontal' as const,
    hideChildHeaders: false,
    header: {
      template:
        "<span style='display:block'>${top}</span><span style='color:#2a99be;font-size:11px'>${bottom}</span>",
      values: { top: '통계', bottom: 'Stats' },
    },
    items: ['plays', 'featuring', 'duration'],
  },
]

// ── Tree rows (Albums → Tracks) ───────────────────────────────────────────────

const rows = [
  {
    name: 'KARMA',
    artist: 'BIG Naughty',
    year: 2023,
    label: 'IOAH',
    genre: 'Trap',
    plays: '',
    featuring: '',
    duration: '',
    children: [
      {
        name: '그래서 나는 없다',
        artist: 'BIG Naughty',
        year: 2023,
        label: 'IOAH',
        genre: 'Trap',
        plays: 4820000,
        featuring: '',
        duration: '3:42',
      },
      {
        name: '달리기',
        artist: 'BIG Naughty',
        year: 2023,
        label: 'IOAH',
        genre: 'R&B',
        plays: 3100000,
        featuring: 'Crush',
        duration: '3:15',
      },
      {
        name: 'Lie',
        artist: 'BIG Naughty',
        year: 2023,
        label: 'IOAH',
        genre: 'Trap',
        plays: 2450000,
        featuring: '',
        duration: '2:58',
      },
    ],
  },
  {
    name: 'Phlip',
    artist: 'pH-1',
    year: 2021,
    label: 'H1GHR',
    genre: 'Trap',
    plays: '',
    featuring: '',
    duration: '',
    children: [
      {
        name: 'TETRIS',
        artist: 'pH-1',
        year: 2021,
        label: 'H1GHR',
        genre: 'Trap',
        plays: 5390000,
        featuring: 'Jay Park',
        duration: '2:47',
      },
      {
        name: 'Red Tape',
        artist: 'pH-1',
        year: 2021,
        label: 'H1GHR',
        genre: 'Hip-Hop',
        plays: 2810000,
        featuring: '',
        duration: '3:21',
      },
      {
        name: 'Nerdy Love',
        artist: 'pH-1',
        year: 2021,
        label: 'H1GHR',
        genre: 'R&B Rap',
        plays: 3640000,
        featuring: 'Sik-K',
        duration: '3:08',
      },
    ],
  },
  {
    name: 'The Blind Star',
    artist: 'BewhY',
    year: 2016,
    label: 'SMTM',
    genre: 'Boom Bap',
    plays: '',
    featuring: '',
    duration: '',
    children: [
      {
        name: 'GOTTASADAE',
        artist: 'BewhY',
        year: 2016,
        label: 'SMTM',
        genre: 'Boom Bap',
        plays: 6120000,
        featuring: '',
        duration: '4:03',
      },
      {
        name: 'Day Day',
        artist: 'BewhY',
        year: 2016,
        label: 'SMTM',
        genre: 'Conscious',
        plays: 4370000,
        featuring: '',
        duration: '3:55',
      },
      {
        name: 'Forever',
        artist: 'BewhY',
        year: 2016,
        label: 'SMTM',
        genre: 'Boom Bap',
        plays: 3990000,
        featuring: 'The Quiett',
        duration: '3:38',
      },
    ],
  },
  {
    name: 'Around',
    artist: 'Loco',
    year: 2022,
    label: 'AOMG',
    genre: 'R&B Rap',
    plays: '',
    featuring: '',
    duration: '',
    children: [
      {
        name: '주말이 지나면',
        artist: 'Loco',
        year: 2022,
        label: 'AOMG',
        genre: 'R&B Rap',
        plays: 3150000,
        featuring: 'pH-1',
        duration: '3:52',
      },
      {
        name: 'Ordinary',
        artist: 'Loco',
        year: 2022,
        label: 'AOMG',
        genre: 'R&B',
        plays: 2280000,
        featuring: '',
        duration: '3:44',
      },
    ],
  },
]

export const Default: Story = {
  args: {
    columns,
    rows,
    childrenField: 'children',
    rootKey: 'items',
    height: '400px',
    editable: false,
  },
}

export const WithColumnLayout: Story = {
  args: {
    columns,
    rows,
    childrenField: 'children',
    rootKey: 'items',
    height: '400px',
    editable: false,
  },
}

export const Editable: Story = {
  args: {
    columns,
    rows,
    childrenField: 'children',
    rootKey: 'items',
    height: '400px',
    editable: true,
  },
}

export const WithRowStyle: Story = {
  args: {
    columns,
    rows,
    childrenField: 'children',
    rootKey: 'items',
    height: '400px',
    editable: false,
    parentRowStyle: 'background-color:#e8f4fd;font-weight:bold',
    childRowStyle: '',
  },
}

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    childrenField: 'children',
    rootKey: 'items',
    height: '300px',
  },
}
