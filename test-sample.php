<?php

namespace App\Models;

use App\Contracts\UserInterface;

class User implements UserInterface
{
    private $name;
    private $email;
    public const STATUS_ACTIVE = 1;
    public const STATUS_INACTIVE = 0;
    
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
    }
    
    public function getName(): string
    {
        return $this->name;
    }
    
    public function getEmail(): string
    {
        return $this->email;
    }
    
    public function setName(string $name): void
    {
        $this->name = $name;
    }
    
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
    
    public static function createFromArray(array $data): self
    {
        return new self($data['name'], $data['email']);
    }
}

trait Timestampable
{
    private $createdAt;
    private $updatedAt;
    
    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }
    
    public function touch(): void
    {
        $this->updatedAt = new \DateTime();
    }
}
