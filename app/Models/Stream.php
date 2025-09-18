<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Stream extends Model
{
    use HasFactory, SoftDeletes;

    public $incrementing = false; // because we’re using UUID
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'tokens_price',
        'stream_type_id',
        'date_expiration',
    ];

    protected static function booted()
    {
        static::creating(function ($stream) {
            if (!$stream->id) {
                $stream->id = Str::uuid()->toString();
            }
        });
    }

    public function type()
    {
        return $this->belongsTo(StreamType::class, 'stream_type_id');
    }
}
