'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

interface BpmFilterProps {
    onApply: (values: {
        type: 'exact' | 'range';
        min?: number;
        max?: number;
    }) => void;
    onClear: () => void;
}

export default function BpmFilter({ onApply, onClear }: BpmFilterProps) {
    const [filterType, setFilterType] = useState<'exact' | 'range'>('exact');
    const [exactBpm, setExactBpm] = useState('');
    const [minBpm, setMinBpm] = useState('');
    const [maxBpm, setMaxBpm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleApply = () => {
        if (filterType === 'exact' && exactBpm) {
            const bpmValue = parseInt(exactBpm);
            onApply({ type: 'exact', min: bpmValue });
            setActiveFilter(`${bpmValue} BPM`);
        } else if (filterType === 'range' && minBpm && maxBpm) {
            const minValue = parseInt(minBpm);
            const maxValue = parseInt(maxBpm);
            onApply({ type: 'range', min: minValue, max: maxValue });
            setActiveFilter(`${minValue}-${maxValue} BPM`);
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        setExactBpm('');
        setMinBpm('');
        setMaxBpm('');
        setActiveFilter(null);
        onClear();
        setIsOpen(false);
    };

    const isApplyDisabled =
        (filterType === 'exact' && !exactBpm) ||
        (filterType === 'range' &&
            (!minBpm || !maxBpm || parseInt(minBpm) >= parseInt(maxBpm)));

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 gap-2"
                >
                    {activeFilter || 'BPM'}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
                <div className="space-y-4">
                    <RadioGroup
                        value={filterType}
                        onValueChange={(value: 'exact' | 'range') =>
                            setFilterType(value)
                        }
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exact" id="exact" />
                            <Label htmlFor="exact">Exact BPM</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="range" id="range" />
                            <Label htmlFor="range">BPM Range</Label>
                        </div>
                    </RadioGroup>

                    {filterType === 'exact' ? (
                        <div className="space-y-2">
                            <Label htmlFor="exactBpm">BPM</Label>
                            <Input
                                id="exactBpm"
                                type="number"
                                min="1"
                                value={exactBpm}
                                onChange={(e) => setExactBpm(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white"
                                placeholder="Enter BPM"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="minBpm">Min BPM</Label>
                                    <Input
                                        id="minBpm"
                                        type="number"
                                        min="1"
                                        value={minBpm}
                                        onChange={(e) =>
                                            setMinBpm(e.target.value)
                                        }
                                        className="bg-zinc-900 border-zinc-800 text-white"
                                        placeholder="Min"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="maxBpm">Max BPM</Label>
                                    <Input
                                        id="maxBpm"
                                        type="number"
                                        min="1"
                                        value={maxBpm}
                                        onChange={(e) =>
                                            setMaxBpm(e.target.value)
                                        }
                                        className="bg-zinc-900 border-zinc-800 text-white"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            {minBpm &&
                                maxBpm &&
                                parseInt(minBpm) >= parseInt(maxBpm) && (
                                    <p className="text-red-500 text-sm">
                                        Maximum BPM must be greater than minimum
                                        BPM
                                    </p>
                                )}
                        </div>
                    )}

                    <div className="flex justify-between pt-2">
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={isApplyDisabled}
                            className="bg-emerald-500 text-black hover:bg-emerald-600 disabled:opacity-50"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
