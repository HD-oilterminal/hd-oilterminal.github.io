import type { Meta, StoryObj } from '@storybook/vue3'
import RealGrid from './RealGrid.vue'
import {DataColumn} from "realgrid";
import { GridColumn, GridData } from '@/types/grid'

const meta: Meta<typeof RealGrid> = {
  title: 'Common/RealGrid',
  component: RealGrid,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'text' },
    editable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof RealGrid>

const columns: GridColumn[] = [
  { fieldName: 'artist', name: '아티스트', width: 120 },
  { fieldName: 'title', name: '곡명', width: 180 },
  { fieldName: 'album', name: '앨범', width: 160 },
  { fieldName: 'year', name: '발매연도', width: 80 },
  { fieldName: 'label', name: '레이블', width: 120 },
  { fieldName: 'genre', name: '장르', width: 100 },
  { fieldName: 'plays', name: '재생수', width: 90 },
  { fieldName: 'featuring', name: '피처링', width: 120 },
]

const rows: GridData[] = [
  {
    artist: 'BIG Naughty',
    title: '그래서 나는 없다',
    album: 'KARMA',
    year: 2023,
    label: 'IOAH',
    genre: 'Trap',
    plays: 4820000,
    featuring: '',
  },
  {
    artist: 'Loco',
    title: '주말이 지나면',
    album: 'Around',
    year: 2022,
    label: 'AOMG',
    genre: 'R&B Rap',
    plays: 3150000,
    featuring: 'pH-1',
  },
  {
    artist: 'Hash Swan',
    title: 'Hype Boy',
    album: 'Swanson',
    year: 2023,
    label: 'Independent',
    genre: 'Boom Bap',
    plays: 2740000,
    featuring: '',
  },
  {
    artist: 'pH-1',
    title: 'TETRIS',
    album: 'Phlip',
    year: 2021,
    label: 'H1GHR',
    genre: 'Trap',
    plays: 5390000,
    featuring: 'Jay Park',
  },
  {
    artist: 'Justhis',
    title: '내가 죽던 날',
    album: '3rd MIXTAPE',
    year: 2020,
    label: 'IOAH',
    genre: 'Conscious',
    plays: 1980000,
    featuring: '',
  },
  {
    artist: 'Loopy',
    title: 'METEOR',
    album: 'LOOPY',
    year: 2022,
    label: 'AOMG',
    genre: 'Trap',
    plays: 3870000,
    featuring: 'Woo',
  },
  {
    artist: 'BewhY',
    title: 'GOTTASADAE',
    album: 'The Blind Star',
    year: 2016,
    label: 'SMTM',
    genre: 'Boom Bap',
    plays: 6120000,
    featuring: '',
  },
  {
    artist: 'Khundi Panda',
    title: '아이폰 Flex',
    album: 'P.O.P',
    year: 2019,
    label: 'VMC',
    genre: 'Trap',
    plays: 2560000,
    featuring: 'Superbee',
  },
]

export const Default: Story = {
  args: {
    columns,
    rows,
    height: '300px',
    editable: false,
  },
}

export const Editable: Story = {
  args: {
    columns,
    rows,
    height: '300px',
    editable: true,
  },
}

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    height: '300px',
  },
}
