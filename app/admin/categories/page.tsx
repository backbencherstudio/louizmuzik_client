'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, X, ArrowUpDown } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    order: number;
}

const initialGenres = [
    'Trap',
    'Reggaeton',
    'Afrobeat',
    'Drill',
    'House',
    'Hip Hop',
    'R&B',
    'Brazilian Funk',
    'Amapiano',
    'Dancehall',
    'New Jazz',
    'Moombahton',
    'Future Bass',
    'Pop',
    'Dembow',
    'Psytrance',
    'Dubstep',
    'Merengue',
    'Bachata',
    'Oriental',
    'Reggae',
    'Plug',
    'Phonk',
    'World',
];

const initialArtistTypes = [
    '2 Chains',
    '21 Savage',
    '6lack',
    'A Boogie wit da Hoodie',
    'A$AP Ferg',
    'A$AP Rocky',
    'Alborosie',
    'Alicia Keys',
    'Amapiano',
    'Anuel AA',
    'Arcangel',
    'Bad Bunny',
    'Beenie Man',
    'Benny Sings',
    'Beyoncé',
    'Burna Boy',
    'Cali Y El Dandee',
    'Cardi B',
    'Cartel de Santa',
    'Chamaco Cortez',
    'Chris Brown',
    'Chronixx',
    'Daddy Yankee',
    'Damian Marley',
    'Dandy Mendoza',
    'De La Ghetto',
    'Don Toliver',
    'Don Omar',
    'Duki',
    'Eladio Carrión',
    'Elvis Crespo',
    'Feid',
    'Gazo',
    'Gente De Zona',
    'Gims',
    'Gunna',
    'Guaynaa',
    'IAmChino',
    'J Alvarez',
    'J Balvin',
    'J Quiles',
    'Jay Wheeler',
    'Jhay Cortez',
    'Jowell & Randy',
    'Justin Quiles',
    'Kali Uchis',
    'Karol G',
    'Kevin Gates',
    'Koffee',
    'Lenny Tavarez',
    'Lil Baby',
    'Lil Durk',
    'Lil Tjay',
    'Lunay',
    'Maluma',
    'Manuel Turizo',
    'Maria Becerra',
    'Megan Thee Stallion',
    'Migos',
    'Miky Woodz',
    'Myke Towers',
    'Natti Natasha',
    'Nengo Flow',
    'Nicki Minaj',
    'Nicky Jam',
    'Ñengo Flow',
    'Ozuna',
    'Plan B',
    'Rauw Alejandro',
    'Romeo Santos',
    'Rosalía',
    'Sean Paul',
    'Sech',
    'Shaggy',
    'Shenseea',
    'Shy Glizzy',
    'Snoop Dogg',
    'Tempo',
    'Tego Calderón',
    'Tokischa',
    'Tory Lanez',
    'Tyga',
    'Tyler The Creator',
    'Wisin',
    'Wisin y Yandel',
    'Yandel',
    'Young Miko',
    'Young Thug',
    'Zion',
    'Zion & Lennox',
];

const initialCountries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
];

export default function CategoriesPage() {
    const [countries, setCountries] = useState<Category[]>([]);
    const [artistTypes, setArtistTypes] = useState<Category[]>([]);
    const [genres, setGenres] = useState<Category[]>([]);
    const [newCountry, setNewCountry] = useState('');
    const [newArtistType, setNewArtistType] = useState('');
    const [newGenre, setNewGenre] = useState('');

    // Initialize genres and artist types when component mounts
    useEffect(() => {
        const initialCountriesList = initialCountries.map((name, index) => ({
            id: `country-${index}`,
            name,
            order: index,
        }));
        setCountries(initialCountriesList);

        const initialGenresList = initialGenres.map((name, index) => ({
            id: `genre-${index}`,
            name,
            order: index,
        }));
        setGenres(initialGenresList);

        const initialArtistTypesList = initialArtistTypes.map(
            (name, index) => ({
                id: `artist-${index}`,
                name,
                order: index,
            })
        );
        setArtistTypes(initialArtistTypesList);
    }, []);

    const addItem = (
        list: Category[],
        setList: (items: Category[]) => void,
        newValue: string
    ) => {
        if (!newValue.trim()) return;

        const newItem = {
            id: Date.now().toString(),
            name: newValue.trim(),
            order: list.length,
        };

        setList([...list, newItem]);
    };

    const removeItem = (
        id: string,
        list: Category[],
        setList: (items: Category[]) => void
    ) => {
        setList(list.filter((item) => item.id !== id));
    };

    const sortAlphabetically = (
        list: Category[],
        setList: (items: Category[]) => void
    ) => {
        const sortedItems = [...list].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        const updatedItems = sortedItems.map((item, index) => ({
            ...item,
            order: index,
        }));
        setList(updatedItems);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const sourceId = result.source.droppableId;
        const destinationId = result.destination.droppableId;

        // Get the correct list and setter based on the droppable ID
        const getListAndSetter = (
            id: string
        ): [Category[], (items: Category[]) => void] => {
            switch (id) {
                case 'countries':
                    return [countries, setCountries];
                case 'artistTypes':
                    return [artistTypes, setArtistTypes];
                case 'genres':
                    return [genres, setGenres];
                default:
                    return [[], () => {}];
            }
        };

        const [sourceList, sourceSetList] = getListAndSetter(sourceId);

        // If dropping in the same list
        if (sourceId === destinationId) {
            const items = Array.from(sourceList);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedItems = items.map((item, index) => ({
                ...item,
                order: index,
            }));

            sourceSetList(updatedItems);
        }
    };

    const CategoryColumn = ({
        title,
        items,
        setItems,
        droppableId,
        inputValue,
        setInputValue,
        placeholder,
    }: {
        title: string;
        items: Category[];
        setItems: (items: Category[]) => void;
        droppableId: string;
        inputValue: string;
        setInputValue: (value: string) => void;
        placeholder: string;
    }) => (
        <div className="flex-1 min-w-0">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={() => sortAlphabetically(items, setItems)}
                        className="text-zinc-400 hover:text-emerald-500 transition-colors flex items-center gap-2"
                        title="Sort alphabetically"
                    >
                        <ArrowUpDown className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === 'Enter' &&
                            addItem(items, setItems, inputValue)
                        }
                        placeholder={placeholder}
                        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        onClick={() => {
                            addItem(items, setItems, inputValue);
                            setInputValue('');
                        }}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add
                    </button>
                </div>
            </div>

            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg group"
                                    >
                                        <div
                                            {...provided.dragHandleProps}
                                            className="text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <span className="flex-1 text-white">
                                            {item.name}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeItem(
                                                    item.id,
                                                    items,
                                                    setItems
                                                )
                                            }
                                            className="text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-8">
                    Categories Management
                </h1>

                <div className="grid grid-cols-3 gap-8">
                    <CategoryColumn
                        title="Countries"
                        items={countries}
                        setItems={setCountries}
                        droppableId="countries"
                        inputValue={newCountry}
                        setInputValue={setNewCountry}
                        placeholder="Enter country name"
                    />

                    <CategoryColumn
                        title="Artist Types"
                        items={artistTypes}
                        setItems={setArtistTypes}
                        droppableId="artistTypes"
                        inputValue={newArtistType}
                        setInputValue={setNewArtistType}
                        placeholder="Enter artist type"
                    />

                    <CategoryColumn
                        title="Genres"
                        items={genres}
                        setItems={setGenres}
                        droppableId="genres"
                        inputValue={newGenre}
                        setInputValue={setNewGenre}
                        placeholder="Enter genre name"
                    />
                </div>
            </div>
        </DragDropContext>
    );
}
