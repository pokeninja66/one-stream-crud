<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('streams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 255);
            $table->string('description', 655)->nullable();
            $table->integer('tokens_price'); // does this need to be unsigned?
            $table->foreignId('stream_type_id')->nullable()->constrained('stream_types')->nullOnDelete();
            $table->dateTime('date_expiration');
            $table->timestamps();
            // Will be used to soft delete the stream for now. Probably orverkill for this.
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('streams');
    }
};
